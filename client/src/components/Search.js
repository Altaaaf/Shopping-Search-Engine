import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import Results from './Results';
import Searchbar from './Searchbar';
class Search extends Component {
	constructor() {
		super();
		this.state = {
			query: '',
			Results: [],
			PriceFilter: false,
			SimilarityFilter: false,
			BooleanSearchModel: false,
			Loading: false,
		};
	}
	onSelected = (e) => {
		this.setState({ [e.target.id]: e.target.checked });
	};
	onChange = (e) => {
		this.setState({ [e.target.id]: e.target.value });
	};
	onClear = () => {
		this.setState({ Results: [] });
	};
	onClick = () => {
		if (this.state.query === '') {
			toastr.error('Enter a query before searching!');
		} else {
			var RequestAPI = 'http://localhost:5000/Api/VectorSpaceModelQuery';
			if (this.state.BooleanSearchModel) {
				RequestAPI = 'http://localhost:5000/Api/BooleanRetrievalQuery';
			}
			this.setState({ Loading: true });
			axios
				.post(RequestAPI, {
					SearchQuery: this.state.query,
					PriceFilter: this.state.PriceFilter,
					SimilarityFilter: this.state.SimilarityFilter,
				})
				.then((res) => {
					if (res.status === 200) {
						const data = res.data;
						this.setState({ Results: data.SEARCH_RESULTS });
					} else {
						toastr.error('Unexpected failure occured');
					}
					this.setState({ Loading: false });
				})
				.catch((err) => {
					console.log(err);
					toastr.error(err.response.data.status);
					this.setState({ Loading: false });
				});
		}
	};
	render() {
		return (
			<div>
				<br />
				<div className='text-center' style={{ border: '1px solid green' }}>
					{this.state.BooleanSearchModel && <h1>Using Boolean Retrieval Model!</h1>}
					{!this.state.BooleanSearchModel && <h1>Using Vector Space Model!</h1>}
				</div>
				<br />
				<Searchbar
					showSimilarityFilter={!this.state.BooleanSearchModel}
					onChange={this.onChange}
					onClick={this.onClick}
					onSelected={this.onSelected}
					onClear={this.onClear}
				/>
				<Results Loading={this.state.Loading} Results={this.state.Results} />
			</div>
		);
	}
}
export default Search;
