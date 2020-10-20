import React, { FormEvent, useState, ChangeEvent } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from "react-icons/fi";

import Sidebar from '../componets/side-bar';

import '../styles/pages/create-orphanage.css';

import mapIcon from '../utils/mapIcon';
import api from "../services/api";
import { useHistory } from "react-router-dom";

export default function CreateOrphanage() {

  const [position, setPosition] = useState({latitude: 0, longitude: 0})

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const history = useHistory();

  function handleMapClick(event:LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }


  async function handleSubmit(event:FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('latitude', String(latitude));
    formData.append('longitude', String(longitude));
    formData.append('about', about);
    formData.append('instructions', instructions);
    formData.append('opening_hours', opening_hours);
    formData.append('open_on_weekends', String(open_on_weekends));
    images.forEach((image) => {
      formData.append('images', image)
    });

    await api.post('orphanages', formData);

    alert('Cadastro realizado com sucesso');

    history.push('/app');

  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files) {
      return;
    }
    const seletedImages = Array.from(event.target.files)
    setImages(seletedImages);
    const seletedImagesPreview = seletedImages.map(selectedImage => (
      URL.createObjectURL(selectedImage)
    ));
    setPreviewImages(seletedImagesPreview);
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-19.9135286,-43.9653568]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAP_BOX_TOKEN}`}
              />
              {
                position.latitude !== 0 && (
                  <Marker
                    interactive={false}
                    icon={mapIcon}
                    position={[position.latitude,position.longitude]}
                  />
                )
              }

              {/* <Marker interactive={false} icon={mapIcon} position={[-27.2092052,-49.6401092]} /> */}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>
              <div className="images-container">
                {
                  previewImages.map(previewImage => (
                    <img key={previewImage} src={previewImage} alt={name}/>
                  ))
                }
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input multiple onChange={handleSelectImages} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={ open_on_weekends ? 'active' : '' }
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={ !open_on_weekends ? 'active' : '' }
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
