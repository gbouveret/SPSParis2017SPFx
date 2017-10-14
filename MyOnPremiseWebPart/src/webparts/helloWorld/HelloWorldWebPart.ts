import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import * as strings from 'HelloWorldWebPartStrings';
import HelloWorld from './components/HelloWorld';
import { IVideo } from './components/IVideo';
import { IGroup } from './components/IGroup';
import { IHelloWorldProps } from './components/IHelloWorldProps';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { GraphHttpClient, GraphClientResponse } from '@microsoft/sp-http';

export interface IHelloWorldWebPartProps {
  lists: string | string[];
}

export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {

  public render(): void {
    //var props = { videos: [null], groups: null };

    this.getVideos().then((vids) => {
        this.getGroups().then((grps) => {
            const element: React.ReactElement<IHelloWorldProps> = React.createElement(
              HelloWorld,
              {
                videos: vids,
                groups: grps
              }
            );
            ReactDom.render(element, this.domElement);
        });
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  
  private getVideos(): Promise<IVideo[]> {
    let curVids: IVideo[] = [];
    let curGroups: IGroup[] = [];

    return new Promise<IVideo[]>(resolve => {
      if (Environment.type === EnvironmentType.Local) {
        curVids.push({ Title: "Test", VideoSetDefaultEncoding: "http://www.html5videoplayer.net/videos/toystory.mp4" } as IVideo);
        resolve(curVids);
      }
      else {
        if (this.properties.lists) {
          this.context.spHttpClient.get(this.context.pageContext.web.serverRelativeUrl + `/_api/web/lists('` + encodeURI(this.properties.lists as string) + `')/items?$select=Title,VideoSetDefaultEncoding`, SPHttpClient.configurations.v1).then((val: SPHttpClientResponse) => {
            return val.json();
          }).then(res => {
            curVids = res.value.filter(v => { return (v.VideoSetDefaultEncoding); }).map(v => { return { Title: v.Title, VideoSetDefaultEncoding: v.VideoSetDefaultEncoding.Url };});
            resolve(curVids);
          });
        }
        else {
          resolve(curVids);
        }
      }
    });
  }

  private getGroups(): Promise<IGroup[]> {
    let curGroups: IGroup[] = [];

    return new Promise<IGroup[]>((resolve) => {
      if (Environment.type === EnvironmentType.Local) {
        curGroups.push({ Name: "This is a fake group !", Mail: "fakegroup@infinitesquare.com" } as IGroup);
        resolve(curGroups);
      }
      else {
        if (this.context.pageContext.web.absoluteUrl.toLowerCase().indexOf('.sharepoint.com') > 0) {
			// Uncomment to have only groups which name starts with Hub"
		  //this.context.graphHttpClient.get("v1.0/groups?$select=displayName,mail&$filter=startsWith(displayName, 'Hub')", GraphHttpClient.configurations.v1)
          this.context.graphHttpClient.get("v1.0/groups?$select=displayName,mail", GraphHttpClient.configurations.v1)
          .then((response: GraphClientResponse): Promise<any> => {
            return response.json();
          })
          .then((data: any): void => {
            console.log(data);
            curGroups = data.value.map((g) => { 
              return { Name: g.displayName,Mail: g.Name };
            });

            resolve(curGroups);
          });
        }
        else{
          resolve(curGroups);          
        }
      }
    });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneList
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker('lists', {
                  label: 'Select a list',
                  selectedList: this.properties.lists,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  baseTemplate: 851,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
