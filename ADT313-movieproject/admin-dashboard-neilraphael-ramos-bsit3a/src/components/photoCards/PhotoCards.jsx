import React from 'react'
import './PhotoCards.css'

function PhotoCards({ photo }) {
    return (
        <>
            <div className='card-photo-data'>
                <img src={photo.url} alt='photo-movie' />
                <span className='photo-descript-card'>{photo.description}</span>
            </div>
        </>
    )
}

export default PhotoCards