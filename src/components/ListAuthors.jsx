import React, { Component } from 'react';



export default class ListAuthor extends Component {
  constructor(props) {
    super(props);
    const { index } = props;
    this.state = {
         value: index ? index : ""
         }

    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(e) {
    const item = { id: e.target.value};
    this.props.author(item);
    this.setState({ value: e.target.value });
    //console.log(e.target.value);
  };

  
  render() {
   
    return (
      <select name="vid_modelo" value={this.state.value} onChange={this.handleChange}
        style={{ display: "block", width: '100%' }}>
        <option key="" value="">Selecione</option>
        {this.props.items.map(item => (
          <option key={item.id} value={item.id}>{
              (item.firstName ? item.firstName : "")
            + (item.lastName ? " " + item.lastName : "")
           }</option>
        ))}
      </select >
    );
  }
}