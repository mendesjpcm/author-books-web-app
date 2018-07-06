import React, { Component } from 'react';


export default class EditButton extends Component {
    constructor(props) {
        super(props);
        var { item } = props;
        this.state = {
            data: item ? item : [],
        }
        this.handleEdit = this.handleEdit.bind(this);
    }
    
    componentWillReceiveProps(nextProps, nextState) {
        this.setState({ data: nextProps.item });
    }

    handleEdit() {
        if (this.state.data) {
            this.props.clicked(this.state.data);
        }
    }

    render() {
        return (
            <div>
                <button title="Edit registry." onClick={this.handleEdit} className="btn_full"><i className="fa fa-pencil-square-o" aria-hidden="true" /></button>
            </div>
        );
    }
}