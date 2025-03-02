import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/SobreHeader.css';


const SobreHeader = () => {


  return (
    <div className="sobre-header-container">

      <div>
        <Link to="/termos-de-uso-e-privacidade" className="link-items">
          <p className='text_link'>Termos de Uso e Privacidade</p>
        </Link>
      </div>
      <div>
        <Link to="/sobre-nos" className="link-items">
          <p className='text_link'>Sobre Nós</p>
        </Link>
      </div>
      <div>
        <Link to="/contato" className="link-items">
          <p className='text_link'>Contato</p>
        </Link>
      </div>
      {/*<div>
        <button swg-standard-button="contribution" className='text_link'>Contribua agora</button>
      </div>*/}

    </div>
  );
};

export default SobreHeader;