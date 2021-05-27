const Searchbar = (props) => {
	return (
		<div>
			<input
				type='text'
				name='Query'
				id='query'
				placeholder='Search Query...'
				className='text-center'
				onChange={props.onChange}
			/>
			<input
				type='submit'
				value='Search'
				className='btn btn-dark btn-block'
				onClick={props.onClick}
			/>
			<input
				type='submit'
				value='Clear'
				className='btn btn-dark btn-block'
				onClick={props.onClear}
			/>
			<div className='text-center'>
				<input type='checkbox' id='BooleanSearchModel' onChange={props.onSelected} />
				<label for='BooleanSearchModel'> Use boolean retrieval model </label>
				<br />
				<input type='checkbox' id='PriceFilter' onChange={props.onSelected} />
				<label for='PriceFilter'> Filter by Product Price (Greatest to Lowest)</label>
				<br />
				{props.showSimilarityFilter && (
					<input type='checkbox' id='SimilarityFilter' onChange={props.onSelected} />
				)}
				{props.showSimilarityFilter && (
					<label for='SimilarityFilter'> Filter by Product Similarity (Greatest to Lowest)</label>
				)}
			</div>
		</div>
	);
};
export default Searchbar;
