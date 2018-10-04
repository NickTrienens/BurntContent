import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class MDE extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }

  onEditorStateChange = (editorState) => {
     this.setState({
      editorState,
    });
  }

  render() {
    const { editorState } = this.state;

    return (

      <Editor
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}
      />

    );
  }
};
