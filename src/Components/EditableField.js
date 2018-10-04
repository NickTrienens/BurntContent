import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { setContent} from '../Services/firebase.js';
const { TextArea } = Input;

var randomColor = () => { "#cc0000" }
var colorMap = [];

export default class EditableField extends React.Component {
  propTypes: {
    className: PropTypes.string,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    contentkey: PropTypes.string,
    fieldType: PropTypes.string,
    submitCallback: PropTypes.func
  }

  constructor(props) {
    super(props);

    let draftText =  props.text;
    if ( props.contentKey === null || props.contentKey === undefined) {
        draftText = "";
    }

    console.log(props.contentKey);

    let defaultText =  props.text;
    if ( props.text === null || props.text === undefined) {
      defaultText = props.placeholder;
    }

    let editingTimeout = props.editingTimeout;
    if (editingTimeout === null || editingTimeout === undefined ){
      editingTimeout = 30000
    }

    this.state = {
      editing: false,
      editingTimer: null,
      locked: false,
      submitting: false,
      draftText: draftText,
      text: defaultText,
      placeholder: this.props.placeholder,
      lastEditor: "",
      contentKey: props.contentKey,
      error: false,
      editingTimeout: editingTimeout,

    }

    this.handleCancel = this.handleCancel.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
    this.success = this.success.bind(this);
    this.failure = this.failure.bind(this);


   //  var comp= this;
   //  monitorEditing( this.props.key, data => {
   //    if (data.lastEdit === null && comp.state.locked) {
   //      comp.setState({ locked: false, text: comp.state.draftText });
   //      return
   //    }
   //    const { lastEdit, lastText, lastEditor } =  data;
   //
   //    //console.log("lastEdit: " + lastEdit + ", lastText: "+  lastText);
   //    const timeDiff = Date.now() - lastEdit;
   //    const hasData = lastText !== null && lastEdit !== null;
   //    //console.log("time: "+ timeDiff + " hasData: "+ hasData);
   //    if( comp.state.editing === false && hasData && timeDiff < this.state.editingTimeout ){
   //      comp.setState({ text: lastText, locked: true, lastEditor: lastEditor, lastEdit: lastEdit});
   //      console.log("locked editing");
   //    }
   // })

  }

  componentWillReceiveProps(nextProps) {
    if (this.state.contentkey === nextProps.contentkey) {
      let draftText =  nextProps.text;
      if(!draftText) {
        draftText = "";
      }
      let defaultText =  nextProps.text;
      if (!defaultText) {
        defaultText = nextProps.placeholder;
      }
      this.setState({text: defaultText, draftText: draftText});
    }
  }

  componentWillUnmount() {
    //unmonitorEditing(this.props.key);
    clearInterval(this.state.intervalId);
  }

  componentDidMount() {
    var intervalId = 0;//setInterval(this.checkIfStillEditting.bind(this), 10000);
    this.setState({didMount: true, intervalId: intervalId});
  }

  success() {
    if ( this.props.contentkey === null ){
      this.setState({submitting: false, text: this.props.placeholder, draftText: this.props.placeholder});
    } else {
      this.setState({submitting: false});
    }
  }

  failure() {
    this.setState({
      submitting: false,
      error: true
    });
  }

  handleClickOutside(e) {
    if (this.wrapperRef &&
        !this.wrapperRef.contains(e.target) &&
        e.target.className.indexOf("contexify") === -1) {
      this.triggerSubmit();
      this.toggleEditing();
    }
  }

  handleCancel(e) {
      if (this.state.editing === true ) {
          this.setState({ draftText: this.state.text });
          this.toggleEditing();
      }
  }

  toggleEditing() {
    if (this.props.preventEditing) {
      return;
    }

    var t = (document.all) ? document.selection.createRange().text : document.getSelection();
    var lenght = t.focusOffset - t.anchorOffset;
    if (lenght !== 0) {
      return
    }
    if ( this.state.editingTimer !== null) {
      clearTimeout(this.state.editingTimer);
    }
    if (this.state.locked) {
      return
    }
    // so we can close on outside click
    if (this.state.editing) {
      document.removeEventListener('mousedown', this.handleClickOutside);
    } else {
      document.addEventListener('mousedown', this.handleClickOutside);
    }

    var isEditting = this.state.editing;

    if (!isEditting) {
      this.setState({editing: true, editingTimer: setTimeout( () => { this.handleCancel() }, this.state.editingTimeout) });
    } else {
      this.setState({editing: false, editingTimer: null });
    }

    if (isEditting) {
      var text = this.state.text;
      this.setState({text: text, draftText: text});
    }
  }

  handleChange(e) {
    if ( this.state.editingTimer !== null) {
      clearTimeout(this.state.editingTimer);
    }
    // console.log(e);
    this.setState({
      draftText: e.target.value,
      editingTimer: setTimeout( () => { this.toggleEditing() }, this.state.editingTimeout)
    });
  }

  // actually submit the request etc.
  triggerSubmit() {
    this.setState({
      text: this.state.draftText,
      submitting: true,
    });
    console.log(this.state.contentKey);
    setContent(this.state.contentKey, this.state.draftText)

    // submit
    this.props.submitCallback(this.state.draftText, this.success, this.failure);
  }

  // check for enter or cancel
  handleKeyDown(e) {
    const enter_key = 13;
    const escape_key = 27;

    if (e.keyCode === enter_key) {
      this.toggleEditing();
      this.triggerSubmit();
    } else if (e.keyCode === escape_key) {
      this.toggleEditing();
    }
  }

  render() {
    const { locked, lastEditor } = this.state
    //let controlLinks;

    let editing;
    let textOrInput;
    let spinner;
    let error;

    if (this.state.error) {
      error = <span className="error">error!</span>
    }

    if (this.state.submitting) {
      spinner = <span>...</span>
    }

    if (this.state.editing) {

      textOrInput = <TextArea
                      autosize
                      autoFocus
                      placeholder={this.state.placeholder}
                      id={this.props.id}
                      onChange={this.handleChange}
                      onKeyDown={this.handleKeyDown}
                      value={this.state.draftText}
                      className="text-while-editing"/>
      editing = 'editing';
    } else {

      if (locked ) {
        if (colorMap[lastEditor] === undefined) {
          colorMap[lastEditor] = randomColor();
        }
        var color = colorMap[lastEditor];
        textOrInput = <div style={{ borderColor: color }} className="editing-container"><div style={{ color: color }} className="editor-name">{lastEditor}</div><div className="text-locked" id={this.state.contentkey}><span onClick={this.toggleEditing} >{this.state.text}</span></div></div>
      } else {
        textOrInput = <div onClick={this.toggleEditing} id={this.state.contentkey}><span className="text">{this.state.text}</span></div>
      }
      //controlLinks = <a className="edit-link blue-link" onClick={this.toggleEditing} href="#">EDIT</a>
      editing = '';
    }

    return (
      <div
        key={this.state.contentkey}
        className={`${this.props.className} ${editing} editable-field`}
        ref={(node) => { this.wrapperRef = node; }}
      >
        {textOrInput}
        {spinner}
        {error}

      </div>
    );
  }
}
