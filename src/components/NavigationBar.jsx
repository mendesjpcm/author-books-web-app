import React from 'react';
import createReactClass from 'create-react-class';
import { withRouter } from 'react-router-dom';
import * as Constant from '../common/Constant';

let NavigationBarComponent = withRouter(props => <_NavigationBarComponent {...props} />);

let _NavigationBarComponent = createReactClass({
    render: function () {
        this.pathArr = this.props.location.pathname.split('/');
        this.pathArr.shift();

        this.getPath = function (locationIndex) {
            return this.props.location.pathname.split('/')
                .splice(0, locationIndex + 2).join('/');
        };
        const retorno = this.pathArr.map((p, index) => {
            return (<span key={index} style={{ fontSize: '10px' }}>
                {Constant.ROUTES_TITLE[this.getPath(index)]}</span>);
        })

        return (
            <div >
             {retorno}
            </div>
        );
    }
});

export default NavigationBarComponent;