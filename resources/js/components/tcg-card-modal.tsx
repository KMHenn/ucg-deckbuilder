import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  background: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '5%',
  p: 4,
};

export default function TcgCardModal({card, open, onClose}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                {card && (
                    <div className="flex flex-col items-center">
                        <div className="mb-4">
                            <h2 className="text-4xl font-bold">{card.name}</h2>
                            <h3 className="mx-auto w-fit">{card.subtitle ?? ''}</h3>
                        </div>
                        <img className="w-50 mb-4" src={card.thumbnail_url} alt={card.detailed_name}/>
                        <p className="mb-4">{card.effect} {card.errata !== null ? (<a className="text-cyan-500 hover:underline" href={card.errata} target="_blank">Errata Issued</a>) : ''}</p>
                    </div>
                )}
            </Box>
        </Modal>
    );
}
