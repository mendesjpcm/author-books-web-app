import React, { Component } from 'react';
import * as AuthorsService from '../../service/AuthorsService';
import { If, Else } from 'react-if';
import { toast } from 'react-toastify';
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import ReactModal from 'react-modal';

ReactModal.setAppElement('body')

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

export default class AuthorsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listAuthors: [],
            authorEdit: [],
            showFormView: false
        }

        this.loadAuthors = this.loadAuthors.bind(this);
        this.refreshView = this.refreshView.bind(this);
        this.sortRows = this.sortRows.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSaveAuthor = this.handleSaveAuthor.bind(this);
        this.handleDeleteAuthor = this.handleDeleteAuthor.bind(this);
    }
    componentWillMount() {
        this.refreshView();
    }

    refreshView() {
        this.loadAuthors();
    }

    loadAuthors() {
        AuthorsService.FindAll().then(
            (response) => {
                this.setState({ listAuthors: this.sortRows(response.data) });
            },
            (err) => {
                console.log(err);
            }
        )
    }

    sortRows(data) {
        var rows = data.slice();
        rows.sort((a, b) => {
            var sortVal = 0;
            if (a["firstName"] > b["firstName"]) {
                sortVal = 1;
            }
            if (a["firstName"] < b["firstName"]) {
                sortVal = -1;
            }

            return sortVal;
        });
        return rows;
    }

    handleLoginClick() {
        this.setState({ showFormView: true });
    }

    handleLogoutClick() {
        this.setState({ showFormView: false, authorEdit: [] });
        this.refreshView();
    }

    handleEdit(obj) {
        // alert(`post\n\nthis.state =\n${JSON.stringify(obj, null, 2)}`);
        this.setState({ authorEdit: obj });
        this.handleLoginClick();
    }

    handleSaveAuthor(obj) {
        //alert(`post\n\nthis.state =\n${JSON.stringify(obj, null, 2)}`);
        if (obj.id !== 0) {
            AuthorsService.Update(obj)
                .then(
                    (response) => {
                        console.log(response.status);
                        if (response.status === 200) {
                            toast.success("Operation success!", {
                                position: toast.POSITION.TOP_CENTER
                            });
                        } else {
                            toast.error("Operation failed!", {
                                position: toast.POSITION.TOP_CENTER
                            });
                        }

                        this.refreshView();
                    },
                    (err) => {
                        console.error(err);
                        toast.error("Operation failed!", {
                            position: toast.POSITION.TOP_CENTER
                        });
                    })
        } else {
            const AuthorObj = {
                firstName: obj.firstName,
                lastName: obj.lastName
            }
            AuthorsService.Save(AuthorObj)
                .then(
                    (response) => {
                        console.log(response.status);
                        if (response.status === 200) {
                            toast.success("Operation success!", {
                                position: toast.POSITION.TOP_CENTER
                            });
                        } else {
                            toast.error("Operation failed!", {
                                position: toast.POSITION.TOP_CENTER
                            });
                        }

                        this.refreshView();
                    },
                    (err) => {
                        console.error(err);
                        toast.error("Operation failed!", {
                            position: toast.POSITION.TOP_CENTER
                        });
                    })
        }
    }

    handleDeleteAuthor(obj) {
        //alert(`post\n\nthis.state =\n${JSON.stringify(obj, null, 2)}`);
        AuthorsService.Delete(obj).then(
            (response) => {
                console.log(response);
                if (response.status === 200) {
                    toast.success("Operation success!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                } else {
                    toast.error("Operation failed!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
                this.refreshView();
            },
            (error) => {
                console.error(error);
                toast.error("Operation failed!", {
                    position: toast.POSITION.TOP_CENTER
                });
            })
    }


    render() {
        const formView = this.state.showFormView;
        let content = null;
        if (formView) {
            content = <FormAuthors onClick={this.handleLogoutClick} AuthorEdit={this.state.authorEdit} taskSave={(obj) => this.handleSaveAuthor(obj)} />
        } else {
            content = <Listing onClick={this.handleLoginClick} items={this.state.listAuthors} taskEdit={(obj) => this.handleEdit(obj)}
                taskDelete={(obj) => this.handleDeleteAuthor(obj)} />
        }
        return (

            <div className="main">
                {content}
            </div>

        );
    }
}

class Listing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            filteredDataList: this.props.items.length > 0 ? this.props.items : [],
            fieldFIlter: 'firstName',
            sortBy: 'firstName',
            sortDir: 'ASC'
        }

        this.editData = this.editData.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.onFilterChange = this.onFilterChange.bind(this);
        this.sortRowsBy = this.sortRowsBy.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState) {
        this.setState({ filteredDataList: nextProps.items, list: nextProps.items });
    }

    editData(obj) {
        this.props.taskEdit(obj);
    }
    deleteData(obj) {
        this.props.taskDelete(obj);
    }

    handleChangeSelect(e) {
        this.setState({ fieldFIlter: e.target.value })
    }

    onFilterChange(event) {
        let lista = this.state.list;

        if (!event.target.value || event.target.value.length === 0) {
            this.setState({
                filteredDataList: lista,
            });
        }
        var filterBy = event.target.value.toString().toLowerCase();
        var size = this.state.list.length;
        var filteredList = [];

        for (var index = 0; index < size; index++) {
            var v = this.state.list[index][this.state.fieldFIlter];
            if (v.toString().toLowerCase().indexOf(filterBy) !== -1) {
                filteredList.push(this.state.list[index]);
            }
        }

        this.setState({
            filteredDataList: filteredList,
        });
    }

    sortRowsBy(cellDataKey) {
        var sortDir = this.state.sortDir;
        var sortBy = cellDataKey;
        if (sortBy === this.state.sortBy) {
            sortDir = this.state.sortDir === 'ASC' ? 'DESC' : 'ASC';
        } else {
            sortDir = 'DESC';
        }
        var rows = this.state.filteredDataList.slice();
        rows.sort((a, b) => {
            var sortVal = 0;
            if (a[sortBy] > b[sortBy]) {
                sortVal = 1;
            }
            if (a[sortBy] < b[sortBy]) {
                sortVal = -1;
            }

            if (sortDir === 'DESC') {
                sortVal = sortVal * -1;
            }
            return sortVal;
        });

        this.setState({ sortBy, sortDir, filteredDataList: rows });
    }

    render() {
        var sortDirArrow = '';
        if (this.state.sortDir !== null) {
            sortDirArrow = this.state.sortDir === 'DESC' ? <span><i className="fa fa-arrow-down" aria-hidden="true"></i></span> : <span><i className="fa fa-arrow-up" aria-hidden="true"></i></span>;
        }
        return (

            <div >
                <div className="container-fluid">


                    <h1 className="page-header"> Authors </h1>

                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-sm text-left" >
                                    <div className="row">
                                        <If condition={this.props.items !== null && this.props.items.length > 0}>
                                            <div className="col-md-auto" >
                                                <select onChange={this.handleChangeSelect} style={{ display: "block", height: '30px' }}>
                                                    <option key="1" value="firstName">First name</option>
                                                    <option key="2" value="lastName">Last name</option>
                                                </select>

                                            </div>
                                        </If>
                                        <If condition={this.props.items !== null && this.props.items.length > 0}>
                                            <div className="col">
                                                <div className="input-group">
                                                    <span className="input-group-addon" style={{ height: "34px" }}><i className="fa fa-search" aria-hidden="true"></i></span>
                                                    <input type="text" className="form-control" style={{zIndex:0}} onChange={this.onFilterChange} placeholder="Search for..." maxLength="20" />
                                                </div>
                                            </div>
                                        </If>
                                    </div>
                                </div>
                                <div className="col-sm text-right">
                                    <button className="btn_full" title="Add new author." onClick={this.props.onClick}>Add new</button>
                                </div>
                            </div>
                            <div >
                                <If condition={this.props.items.length > 0}>
                                    <table id="myTable">
                                        <thead>
                                            <tr>
                                                <th><span className="focusmouse" onClick={() => this.sortRowsBy("firstName")}>First name {this.state.sortBy === 'firstName' ? sortDirArrow : ''}</span></th>
                                                <th><span className="focusmouse" onClick={() => this.sortRowsBy("lastName")}>Last name {this.state.sortBy === 'lastName' ? sortDirArrow : ''}</span></th>
                                                <th>Remove</th>
                                                <th>Edit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.filteredDataList.map(item => (
                                                <TableRow key={item.id} data={item} delete={(obj) => this.deleteData(obj)} edit={(obj) => this.editData(obj)} />
                                            ))}
                                        </tbody>
                                    </table>
                                    <Else>
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td className="span7" style={{ fontStyle: 'oblique', textAlign: 'center' }}><span>- no data to display -</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Else>
                                </If>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

class TableRow extends Component {
    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleDelete(obj) {
        this.props.delete(obj);
    }

    handleEdit(obj) {
        this.props.edit(obj);
    }

    render() {
        return (
            <tr>
                <td ><span>{this.props.data.firstName}</span></td>
                <td><span>{this.props.data.lastName}</span></td>
                <td ><DeleteButton item={this.props.data} clicked={(obj) => this.handleDelete(obj)} /></td>
                <td ><EditButton item={this.props.data} clicked={(obj) => this.handleEdit(obj)} /></td>
            </tr>
        );
    }
}

class FormAuthors extends Component {
    constructor(props) {
        super(props);
        const { AuthorEdit } = props;
        this.state = {
            id: AuthorEdit.id ? AuthorEdit.id : '',
            firstName: AuthorEdit.firstName ? AuthorEdit.firstName : '',
            lastName: AuthorEdit.lastName ? AuthorEdit.lastName : '',
            showModal1: false,
            showModal3: false,
            lostChanges: false,

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpenModal1 = this.handleOpenModal1.bind(this);
        this.handleCloseModal1 = this.handleCloseModal1.bind(this);
        this.handleOpenModal3 = this.handleOpenModal3.bind(this);
        this.handleCloseModal3 = this.handleCloseModal3.bind(this);
        this.checkforLostChanges = this.checkforLostChanges.bind(this);
        this.validate = this.validate.bind(this);
    }

    componentWillUpdate(prevProps, prevState) {
        if (this.state !== prevState) {
            if (prevState.id !== "" || prevState.firstName !== "" || prevState.lastName !== "") {
                if (!this.state.lostChanges) {
                    this.setState({ lostChanges: true });
                }
            }
        }
    }

    handleChange(e) {
        const target = e.currentTarget;

        this.setState({
            [target.name]: target.value
        });
    }

    handleBlur(e) {
        const target = e.currentTarget;
        this.setState({ [target.name]: (target.value).trim() });
    }

    handleSubmit(e) {
        e.preventDefault();

        //alert(`post\n\nthis.state =\n${JSON.stringify(this.state, null, 2)}`);

        const AuthorObj = {
            id: this.state.id ? this.state.id : 0,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }
        this.props.taskSave(AuthorObj);
        this.handleCloseModal1();
        this.props.onClick();
    }

    handleOpenModal1() {
        this.setState({ showModal1: true });
    }

    handleCloseModal1(e) {
        this.setState({ showModal1: false });
    }

    handleOpenModal3() {
        this.setState({ showModal3: true });
    }

    handleCloseModal3(e) {
        this.setState({ showModal3: false });
    }

    checkforLostChanges() {
        if (this.state.lostChanges) {
            this.handleOpenModal3();
        } else {
            this.props.onClick();
        }
    }

    validate() {
        return {
            firstName: this.state.firstName.length === 0,
            lastName: this.state.lastName.length === 0
        }
    }

    render() {
        const errors = this.validate();
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return (
            <div className="panel panel-default" >
                <div className="panel-heading">New Author</div>
                <div className="panel-body">
                    <div className="widget">
                        <div className="row-fluid">
                            <div className="span2">
                                <label id="style2" className="control-label form-fonts" title="Required field."> Firstname <If condition={this.state.firstName.length === 0}><span style={{ color: 'red' }}>*</span></If>:</label>
                            </div>
                            <div className="span5">
                                <input type="text" maxLength='20' required name="firstName" value={this.state.firstName} onChange={this.handleChange} onBlur={this.handleBlur} placeholder="" style={{ width: "100%" }} />
                            </div>
                        </div>
                    </div>
                    <div className="widget">
                        <div className="row-fluid">
                            <div className="span2">
                                <label id="style2" className="control-label form-fonts" title="Required field."> Lastname <If condition={this.state.lastName.length === 0}><span style={{ color: 'red' }}>*</span></If>:</label>
                            </div>
                            <div className="span5">
                                <input type="text" maxLength='20' required name="lastName" value={this.state.lastName} onChange={this.handleChange} onBlur={this.handleBlur} placeholder="" style={{ width: "100%" }} />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="text-right" style={{ marginRight: '10px', paddingBottom: '20px' }}>
                        <button className="btn_full" onClick={this.checkforLostChanges} style={{ marginLeft: "1%" }}>Back</button>
                        <button className="btn_full" style={{ marginLeft: "1%" }} onClick={this.handleOpenModal1} disabled={isDisabled} title={isDisabled ? "Fill in the required fields indicated by the symbol (*)." : "Save."}>Save</button>
                    </div>
                </div>
                <div>
                    <ReactModal isOpen={this.state.showModal1} contentLabel="" style={customStyles}>
                        <h5><i className="fa fa-floppy-o" aria-hidden="true"></i> Message</h5>
                        <p>
                        Confirm registration?
                                            </p>
                        <div className="text-center">
                            <button className="btn_full" onClick={this.handleCloseModal1}>Cancel</button>
                            <button className="btn_full" style={{ marginLeft: "5%" }} onClick={this.handleSubmit}>Confirm</button>

                        </div>
                    </ReactModal>
                </div>
                <div>
                    <ReactModal isOpen={this.state.showModal3} contentLabel="" style={customStyles}>
                        <h5><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> Warning</h5>
                        <p>
                        Do you want to leave this page?<br />
                            <b>Obs:</b> all modifications will be lost.
                        </p>
                        <div className="text-center" style={{ marginRight: "5px", marginBottom: "10px" }} >
                            <button className="btn_full" onClick={this.handleCloseModal3}>Cancel</button>
                            <button className="btn_full" style={{ marginLeft: "5%" }} onClick={this.props.onClick}>Confirm</button>

                        </div>
                    </ReactModal>
                </div>
            </div>
        );
    }
}