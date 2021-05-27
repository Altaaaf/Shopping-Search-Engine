import React, { Fragment } from 'react';
import spinner from './spinner.gif';
export const Loader = () => (
	<Fragment>
		<div className='text-center' style={{ borderTop: '1px solid white' }}>
			<h1>Displaying results soon...</h1>
			<img
				src={spinner}
				alt='Loading...'
				style={{ width: '500px', margin: 'auto', display: 'block' }}
			/>
		</div>
	</Fragment>
);
