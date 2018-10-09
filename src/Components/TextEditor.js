import React from 'react';
import EditableField from './EditableField.js';

export default class TextEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      contentKey: props.contentKey,
      createRow: props.createRow
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.contentKey === nextProps.contentKey) {
      let draftText = nextProps.text;
      if(!draftText) {
        draftText = "";
      }
      let defaultText =  nextProps.text;
      if (!defaultText) {
        defaultText = nextProps.placeholder;
      }
      console.log(nextProps);
      this.setState({text: defaultText, draftText: draftText, data: nextProps.data, createRow: false});
    }
  }

  render() {
    const { data, contentKey, createRow } = this.state;
    var text = "";
    if ( data !== null && data !== undefined ){
        text  = data.text;
    }
    return <EditableField
                text={text}
                className="story-title"
                contentKey={contentKey}
                createRow={createRow}
                submitCallback={ (text, success, failure) => {

                  success();

              }
           }
        />
  }
}
