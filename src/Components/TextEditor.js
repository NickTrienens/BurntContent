import React from 'react';
import ReactDOM from 'react-dom';
import EditableLabel from 'react-inline-editing';
import EditableField from './EditableField.js';
import { setContent} from '../Services/firebase.js';

export default class TextEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      contentKey: props.contentKey,
      createRow: props.createRow
    }
    this._handleFocus = this._handleFocus.bind(this);
  this._handleFocusOut = this._handleFocusOut.bind(this);
}

_handleFocus(text) {
    const { data, contentKey, createRow } = this.state;
    console.log('Focused with text: ' + text);

}

_handleFocusOut(text) {
    const { data, contentKey, createRow } = this.state;
    console.log('Left editor with text: ' + text);
    setContent(contentKey, text)
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

    return <EditableLabel text={text}
               labelClassName='myLabelClass'
               inputClassName='myInputClass'
               inputWidth='300px'
               inputHeight='35px'
               inputMaxLength='50'
               labelFontWeight='bold'
               inputFontWeight='bold'
               onFocus={this._handleFocus}
               onFocusOut={this._handleFocusOut}
           />

    // return <EditableField
    //             text={text}
    //             className="story-title"
    //             contentKey={contentKey}
    //             createRow={createRow}
    //             submitCallback={ (text, success, failure) => {
    //
    //               success();
    //
    //           }
    //        }
    //     />
  }
}
