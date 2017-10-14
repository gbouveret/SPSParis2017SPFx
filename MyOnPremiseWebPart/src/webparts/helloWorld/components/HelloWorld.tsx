import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';  

export default class HelloWorld extends React.Component<IHelloWorldProps, {}> {
   constructor(props: IHelloWorldProps) {
     super(props);
  }

  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
            <div className="ms-Grid-col ms-xl12">
              <span className="ms-font-xl ms-fontColor-white">Videos Corner</span>
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
            <div className="ms-Grid-col ms-xl12">
              {this.props.videos.map((val, idx) => { 
                  if (val.VideoSetDefaultEncoding) return (
                    <div className="ms-Grid-col ms-xl6" key={idx}>
                      <h4 className="ms-font-s ms-fontColor-white">{val.Title}</h4>
                      <video width="100%" controls src={val.VideoSetDefaultEncoding}></video>
                  </div>);
              })}
            </div>
        </div>
        { this.props.groups && this.props.groups.length > 0 && (
          <div>
            <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
              <div className="ms-Grid-col ms-xl12">
                <span className="ms-font-xl ms-fontColor-white">Groups (Bonus)</span>
              </div>
            </div>
            <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                <div className="ms-Grid-col ms-xl12">
                  {this.props.groups.map((val, idx) => { 
                      return (
                        <div className="ms-Grid-col ms-xl6" key={idx}>
                          <span className="ms-font-m ms-fontColor-white">{val.Name}</span>&nbsp;
                          (<span className="ms-font-s ms-fontColor-white">{val.Mail}</span>)
                        </div>);
                  })}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    );
  }
}
