import React from 'react';
import { Loader } from './Loader';
import ResultItem from './ResultItem';
const Results = (props) => {
	if (props.Loading) {
		return <Loader />;
	} else {
		return (
			<div style={SearchStyle}>
				{props.Results &&
					props.Results.map((result, index) => {
						return (
							<ResultItem
								key={result.id}
								Image={
									result.Image
										? result.Image
										: 'https://www.etsy.com/images/mobile-landing/icon-etsy-app@2x.png'
								}
								Quantity={result.Item.Quantity}
								PurchaseURL={result.Item.PurchaseURL}
								Title={result.Item.Title}
								Price={result.Item.Price}
								Currency={result.Item.Currency}
								Similarity={result.Item.SIMILARITY}
							/>
						);
					})}
			</div>
		);
	}
};
const SearchStyle = {
	display: 'grid',
	gridTemplateColumns: 'repeat(3, 1fr)',
	gridGap: '2rem',
};
export default Results;
