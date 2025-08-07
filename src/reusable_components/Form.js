import React, {Component} from "react";
import Joi from 'joi-browser';

export default class Form extends Component {

    validateProperty = ({name, value}) => {
        const obj = {[name]: value};
        const schema = {[name]: this.schema[name]};
        const {error} = Joi.validate(obj, schema);
        return error ? error.details[0].message : null;
    };

    handleChange = ({currentTarget: input}) => {
        const errors = {...this.state.errors};
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];
        const data = {...this.state.data};
        data[input.name] = input.value;
        console.log("error", errors);
        this.setState({data, errors})
    };

    changeHidden = (event) => {
        event.preventDefault()
        this.setState({isHidden: !this.state.isHidden})
    }

    onIconClick = (event) => {
        event.preventDefault()
        this.setState({
            isHidden: !this.state.isHidden
        })
    };

    handleSubmit = event => {
        event.preventDefault();
        const errors = this.validateForm();
        this.setState({errors: errors || {}});
        if (errors) return;
        this.doSubmit(event);
    };

    validateForm = () => {
        const options = {abortEarly: false};
        const {error} = Joi.validate(this.state.data, this.schema, options);
        if (!error) return null;
        const errors = {};

        for (let item of error.details)
            errors[item.path[0]] = item.message;
        // if (errors[item.path[0]] === 'profile') {
        //     debugger
        //     errors[item.path[1]] = item.message;
        // } else {
        //     debugger
        //     errors[item.path[0]] = item.message;
        // }
        return errors;
    }

}
