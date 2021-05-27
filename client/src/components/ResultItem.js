const ResultItem = (props) => {
	const { PurchaseURL, Title, Price, Currency, Image, Quantity, Similarity } = props;
	return (
		<div className='card text-center' style={{ border: '1px solid green' }}>
			<img src={Image} alt='image not found' className='round-img' style={{ width: '60px' }} />
			<h3>{Title}</h3>
			<div>
				<div style={{ border: '1px solid grey' }}>
					Cost: {Price} {Currency}
					<br />
					Quantity: {Quantity}
					<br />
					{Similarity > 0 && <p>Product similarity to query: {Similarity} %</p>}
					<br />
				</div>
				<a href={PurchaseURL} className='btn btn-dark btn-sm my-1' target='_blank' rel='noreferrer'>
					View Purchase Page
				</a>
			</div>
		</div>
	);
};
export default ResultItem;
