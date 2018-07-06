import React from 'react';
import createReactClass from 'create-react-class';
import { Link, withRouter } from 'react-router-dom';
import * as Constant from '../common/Constant';
import { ToastContainer } from 'react-toastify';

let SideBarComponent = withRouter(props => <_SideBarComponent {...props} />);
let _SideBarComponent = createReactClass({
    render: function () {
        if (this.props.location.pathname === Constant.ROUTES.EMPTY) {
            this.props.history.push(Constant.ROUTES.AUTHORS);
        }

        this.resolveActiveState = function (route) {
            return this.props.location.pathname === route ? "active" : "";
        }

        return (
            <div>
                <ToastContainer />
                <div className="sidenav">
                    <Link className={this.resolveActiveState(Constant.ROUTES.AUTHORS)} to={Constant.ROUTES.AUTHORS}><i style={{ marginTop: '-10px' }}></i><span>Authors</span></Link>
                    <Link className={this.resolveActiveState(Constant.ROUTES.BOOKS)} to={Constant.ROUTES.BOOKS}><i style={{ marginTop: '-10px' }}></i><span> Books</span></Link>
                </div>
            </div>
        );
    }
});

export default SideBarComponent;