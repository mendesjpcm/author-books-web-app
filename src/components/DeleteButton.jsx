import React, { Component } from 'react';
import ReactModal from 'react-modal';

const customStyles = {
    content: {
        background: '#fff',
        width: '40%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    }
};

export default class DeleteButton extends Component {
    constructor(props) {
        super(props);
        var { item } = props;
        this.state = {
            data: item ? item : [],
            showModal: false
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleDelete() {
        if (this.state.data) {
            this.props.clicked(this.state.data.id);
        }
        this.setState({ showModal: false });
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal(e) {
        this.setState({ showModal: false });
    }
    render() {
        return (
            <div>
                <button title="Remove registry." onClick={this.handleOpenModal} className="btn_full"><i className="fa fa-times" aria-hidden="true" /></button>
                <ReactModal isOpen={this.state.showModal} contentLabel="" style={customStyles}>
                    <h5><i className="icon-warning-sign"></i> Do you want to delete this record?</h5>
                   
                    <div className="text-center">
                        <button className="btn_full" onClick={this.handleCloseModal}>Cancel</button>
                        <button className="btn_full" style={{ marginLeft: "5%" }} onClick={this.handleDelete}>Confirm</button>
                    </div>
                </ReactModal>
            </div>
        );
    }
}