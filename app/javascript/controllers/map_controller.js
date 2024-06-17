import { Controller } from "stimulus"
import mapboxgl from 'mapbox-gl'

export default class extends Controller {
  static targets = ["map", "placeName", "placeLatitude", "placeLongitude", "listName", "lists"]

  connect() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FtY2RvbmFsZDEyMyIsImEiOiJjbHhoaWdrdjExY2U0MmpzaGplMGJ5YW1zIn0.JJRfYU9b9LrgsAil_l9zfg'

    this.map = new mapboxgl.Map({
      container: this.mapTarget,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    })

    this.map.addControl(new mapboxgl.NavigationControl())

    this.loadLists()
  }

  addPlace(event) {
    event.preventDefault()

    const placeName = this.placeNameTarget.value
    const placeLatitude = this.placeLatitudeTarget.value
    const placeLongitude = this.placeLongitudeTarget.value

    fetch('/places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({
        place: {
          name: placeName,
          latitude: placeLatitude,
          longitude: placeLongitude
        }
      })
    }).then(this.handleJSONResponse)
      .then(data => {
        if (data.id) {
          new mapboxgl.Marker()
            .setLngLat([placeLongitude, placeLatitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${placeName}</h3>`))
            .addTo(this.map)
        } else {
          alert('Failed to add place')
        }
      }).catch(error => console.error('There was a problem with your fetch operation:', error))
  }

  addList(event) {
    event.preventDefault()

    const listName = this.listNameTarget.value

    fetch('/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({
        list: {
          name: listName
        }
      })
    }).then(this.handleJSONResponse)
      .then(data => {
        if (data.id) {
          const li = document.createElement('li')
          li.appendChild(document.createTextNode(data.name))
          this.listsTarget.appendChild(li)
        } else {
          alert('Failed to add list')
        }
      })
  }
}
