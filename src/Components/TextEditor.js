import React from 'react';
import EditableField from './EditableField.js';

export default class TextEditor extends React.Component {

  render() {
    let name = "named"
    let placeholder = "test"
    return <EditableField
                text={name}

                className="story-title"
                contentKey="test"
                submitCallback={ (text, success, failure) => {

                  success();

              }
           }
        />
  }
}
