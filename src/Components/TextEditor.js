import React from 'react';
import EditableField from './EditableField.js';

export default class TextEditor extends React.Component {

  constructor(props) {
    super(props);
    console.log(props.data.text);
    this.state = {
      data: props.data,
      contentKey: props.contentKey,
    }
  }

  render() {
    const { data, contentKey } = this.state;
    var text = "";
    if ( data !== null || data !== undefined ){
        text  = data.text;
    }
    return <EditableField
                text={text}
                className="story-title"
                contentKey={contentKey}
                submitCallback={ (text, success, failure) => {

                  success();

              }
           }
        />
  }
}
