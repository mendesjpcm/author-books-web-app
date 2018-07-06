import React, { Component } from 'react';
import * as AuthorsService from '../../service/AuthorsService';
import * as BooksService from '../../service/BooksService';
import { If, Else } from 'react-if';
import { toast } from 'react-toastify';
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import ListAuthors from '../../components/ListAuthors';
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

export default class BooksView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBooks: [],
            listAuthors: [],
            bookEdit: [],
            showFormView: false,
            listComplete: []
        }

        this.loadBooks = this.loadBooks.bind(this);
        this.loadAuthors = this.loadAuthors.bind(this);
        this.mountObject = this.mountObject.bind(this);
        this.refreshView = this.refreshView.bind(this);
        this.sortRows = this.sortRows.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSaveBook = this.handleSaveBook.bind(this);
        this.handleDeleteBook = this.handleDeleteBook.bind(this);
    }
    componentWillMount() {
        this.refreshView();
    }

    refreshView() {
        this.loadBooks();
        this.loadAuthors();
        //this.mountObject();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.listAuthors != this.state.listAuthors || prevState.listBooks != this.state.listBooks) {
            this.mountObject();
        }
    }


    loadBooks() {
        BooksService.FindAll().then(
            (response) => {
                this.setState({ listBooks: this.sortRows(response.data) });
            },
            (err) => {
                console.log(err);
            }
        )
    }

    loadAuthors() {
        AuthorsService.FindAll().then(
            (response) => {
                this.setState({ listAuthors: response.data });
            },
            (err) => {
                console.log(err);
            }
        )
    }

    mountObject() {
        const listBooks_ = this.state.listBooks;
        const listAuthors_ = this.state.listAuthors;
        var list = [];
        var id_item = -2;
        listBooks_.map((item) => {
            id_item = item.authorId;
            var index = listAuthors_.findIndex(item2 => (item2.id === id_item));
            var obj = {
                title: item.title,
                isbn: item.isbn,
                id: item.id,
                authorId: item.authorId,
                authorName: index != -1 ? listAuthors_[index].firstName + " " + listAuthors_[index].lastName : ''
            }

            list.push(obj);
        });

        this.setState({ listComplete: list })
    }

    sortRows(data) {
        var rows = data.slice();
        rows.sort((a, b) => {
            var sortVal = 0;
            if (a["title"] > b["title"]) {
                sortVal = 1;
            }
            if (a["title"] < b["title"]) {
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
        this.setState({ showFormView: false, bookEdit: [] });
        this.refreshView();
    }

    handleEdit(obj) {
        //alert(`post\n\nthis.state =\n${JSON.stringify(obj, null, 2)}`);
        this.setState({ bookEdit: obj });
        this.handleLoginClick();
    }

    handleSaveBook(obj) {
        //alert(`post\n\nthis.state =\n${JSON.stringify(obj, null, 2)}`);
        if (obj.id !== 0) {
            BooksService.Update(obj)
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
            const BookObj = {
                title: obj.title,
                isbn: obj.isbn,
                authorId: obj.authorId
            }
            BooksService.Save(BookObj)
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

    handleDeleteBook(obj) {
        //alert(`post\n\nthis.state =\n${JSON.stringify(obj, null, 2)}`);
        BooksService.Delete(obj).then(
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
            content = <FormBooks onClick={this.handleLogoutClick} BookEdit={this.state.bookEdit} taskSave={(obj) => this.handleSaveBook(obj)} />
        } else {
            content = <Listing onClick={this.handleLoginClick} items={this.state.listComplete} taskEdit={(obj) => this.handleEdit(obj)}
                taskDelete={(obj) => this.handleDeleteBook(obj)} />
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
            fieldFIlter: 'title',
            sortBy: 'title',
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


                    <h1 className="page-header"> Books </h1>

                    <div className="panel panel-default">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-sm text-left" >
                                    <div className="row">
                                        <If condition={this.props.items !== null && this.props.items.length > 0}>
                                            <div className="col-md-auto" >
                                                <select onChange={this.handleChangeSelect} style={{ display: "block", height: '30px' }}>
                                                    <option key="1" value="title">Title</option>
                                                    <option key="2" value="isbn">Isbn</option>
                                                    <option key="3" value="authorName">Author</option>
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
                                                <th><span className="focusmouse" onClick={() => this.sortRowsBy("title")}>Title {this.state.sortBy === 'title' ? sortDirArrow : ''}</span> </th>
                                                <th><span className="focusmouse" onClick={() => this.sortRowsBy("isbn")}>Isbn {this.state.sortBy === 'isbn' ? sortDirArrow : ''}</span></th>
                                                <th><span className="focusmouse" onClick={() => this.sortRowsBy("authorName")}>Author {this.state.sortBy === 'authorName' ? sortDirArrow : ''}</span></th>
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
                                                    <td style={{ fontStyle: 'oblique', textAlign: 'center' }}><span>- no data to display -</span></td>
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
                <td ><span>{this.props.data.title}</span></td>
                <td><span>{this.props.data.isbn}</span></td>
                <td><span>{this.props.data.authorName}</span></td>
                <td><DeleteButton item={this.props.data} clicked={(obj) => this.handleDelete(obj)} /></td>
                <td><EditButton item={this.props.data} clicked={(obj) => this.handleEdit(obj)} /></td>
            </tr>
        );
    }
}

class FormBooks extends Component {
    constructor(props) {
        super(props);
        const { BookEdit } = props;
        this.state = {
            id: BookEdit.id ? BookEdit.id : '',
            title: BookEdit.title ? BookEdit.title : '',
            isbn: BookEdit.isbn ? BookEdit.isbn : '',
            listAuthors: [],
            authorId: BookEdit.authorId ? BookEdit.authorId : '',
            showModal1: false,
            showModal3: false,
            lostChanges: false,

        }

        this.loadAuthors = this.loadAuthors.bind(this);
        this.sortRows = this.sortRows.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpenModal1 = this.handleOpenModal1.bind(this);
        this.handleCloseModal1 = this.handleCloseModal1.bind(this);
        this.handleOpenModal3 = this.handleOpenModal3.bind(this);
        this.handleCloseModal3 = this.handleCloseModal3.bind(this);
        this.checkforLostChanges = this.checkforLostChanges.bind(this);
        this.validate = this.validate.bind(this);
        this.handleAuthor = this.handleAuthor.bind(this);
    }
    componentWillMount() {
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

        const BookObj = {
            id: this.state.id ? this.state.id : 0,
            title: this.state.title,
            isbn: this.state.isbn,
            authorId: this.state.authorId
        }
        this.props.taskSave(BookObj);
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
            title: this.state.title.length === 0,
            isbn: this.state.isbn.length === 0,
            authorId: this.state.authorId.length === 0
        }
    }

    handleAuthor(item) {
        this.setState({ authorId: item.id });
    }

    render() {
        const errors = this.validate();
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return (
            <div className="panel panel-default" >
                <div className="panel-heading">New Book</div>
                <div className="panel-body">
                    <div className="widget">
                        <div className="row-fluid">
                            <div className="span2">
                                <label id="style2" className="control-label form-fonts" title="Required field."> Title <If condition={this.state.title.length === 0}><span style={{ color: 'red' }}>*</span></If>:</label>
                            </div>
                            <div className="span5">
                                <input type="text" maxLength='20' required name="title" value={this.state.title} onChange={this.handleChange} onBlur={this.handleBlur} placeholder="" style={{ width: "100%" }} />
                            </div>
                        </div>
                    </div>
                    <div className="widget">
                        <div className="row-fluid">
                            <div className="span2">
                                <label id="style2" className="control-label form-fonts" title="Required field."> Isbn <If condition={this.state.isbn.length === 0}><span style={{ color: 'red' }}>*</span></If>:</label>
                            </div>
                            <div className="span5">
                                <input type="text" maxLength='20' required name="isbn" value={this.state.isbn} onChange={this.handleChange} onBlur={this.handleBlur} placeholder="" style={{ width: "100%" }} />
                            </div>
                        </div>
                    </div>
                    <div className="widget">
                        <div className="row-fluid">
                            <div className="span2">
                                <label id="style2" className="control-label form-fonts" title="Required field."> Author <If condition={this.state.authorId.length === 0}><span style={{ color: 'red' }}>*</span></If>:</label>
                            </div>
                            <div className="span5">
                                <ListAuthors items={this.state.listAuthors ? this.state.listAuthors : []} author={this.handleAuthor} index={this.props.BookEdit.authorId ? this.props.BookEdit.authorId : ''} />
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