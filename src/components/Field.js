import React from 'react';
import '@contentful/forma-36-react-components/dist/styles.css';
import {Select, Option} from '@contentful/forma-36-react-components';
import {defaultState} from './defaultState.js';

class Field extends React.Component {
	constructor(props){
		super(props);
		const {sdk} = props;
		const value = sdk.field.getValue();
		this.state = (value) ? value : defaultState;
		this.handleTimeZone = this.handleTimeZone.bind(this);
	};
	
	async componentDidMount(){

		const response = await fetch('https://worldtimeapi.org/api/timezone');
		
		if(response.ok)
		{
			let timeZoneList = await response.json();
			timeZoneList = timeZoneList.map(r => ({text: r, value: r}));
			timeZoneList.unshift({text: '', value: ''});
			this.setState({timeZoneList});
		}
		else
		{
			const {status, statusText} = response;
			console.log({status, statusText});
		}
	}
	
	async handleTimeZone({change}){
		const {sdk} = this.props;
		change = change.target.value;
		
		const response = await fetch(`https://worldtimeapi.org/api/timezone/${change}`);
		
		if(response.ok)
		{
			let data = await response.json();
			
			const {abbreviation, timezone: name, utc_offset: offset, raw_offset: rawOffset} = data;
			
			let timeZone = {abbreviation, name, offset, rawOffset};
			
			sdk.field.setValue({timeZone}).then(v => {
				this.setState({...v});
				console.log({handleTimeZone: v});
			});			
		}
		else
		{
			const {status, statusText} = response;
			console.log({status, statusText});
		}
	}
	
	render(){
		const {sdk} = this.props;	
		const {timeZone} = this.state;
		let {timeZoneList} = this.state;	
		
		sdk.window.updateHeight(50);
		
		const options = (Array.isArray(timeZoneList)) 
		? timeZoneList.map((r, i) => {
			const {value, text} = r;
			return <Option key={value} value={value}>{text ? text : '--'}</Option>;
		})
		: [<Option key={'0'} value={''}>{''}</Option>];
				
		return (
			<Select
				id={'timeZone'}
				value={timeZone.name}
				onChange={(change) => {this.handleTimeZone({change})}}>
				{options}
			</Select>
		);
	}; 
};

export default Field;