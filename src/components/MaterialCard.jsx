import React from "react";
import "../assets/styles.css";

function MaterialCard({ name, total = 0, disponivel = 0, indisponivel = 0, manutencao = 0, missao = 0, imgSrc }) {
    return (
        <div className="material-card">
            <div className="material-card-header">
                <h3 className="material-card-titulo">{name}</h3>
                {imgSrc && (
                    <img
                        src={imgSrc}
                        alt={name}
                        className="material-card-img"
                    />
                )}
            </div>
            <div className="material-card-info">
                <div>
                    Qtd. Total: <span className="numero-total">{total}</span>
                </div>
                <div>
                    Qtd. Disponível: <span className="numero-disponivel">{disponivel}</span>
                </div>
                <div>
                    Qtd. Indisponível: <span className="numero-indisponivel">{indisponivel}</span>
                </div>
                <div>
                    Em Manutenção: <span className="numero-manutencao">{manutencao}</span>
                </div>
                <div>
                    Em Missão: <span className="numero-missao">{missao}</span>
                </div>
            </div>
        </div>
    );
}

export default MaterialCard;


