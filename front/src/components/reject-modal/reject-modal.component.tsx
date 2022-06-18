import { useState } from 'react';
import { Button, Modal, TextField, Typography } from '@mui/material';

import './reject-modal.component.scss';

interface RejectModalComponentProps {
    info: string;
    onClose: () => void;
    onSubmit: (message: string) => void;
}

export const RejectModalComponent = ({ info, onSubmit, onClose }: RejectModalComponentProps): JSX.Element => {
    const [message, setMessage] = useState<string>('');
    return (
        <Modal open onClose={onClose.bind(null)}>
            <div className="reject-modal">
                <Typography variant="h6" component="h2">
                    Подтвердите действие
                </Typography>
                <p className="reject-modal__info">
                    {info}
                </p>
                <TextField
                    inputProps={{ maxLength: 1000 }}
                    fullWidth
                    multiline
                    onChange={event => setMessage(event.target.value)}
                    placeholder="Пожалуйста, укажите причину отклонения заявки (не более 1000 символов)"
                    rows={8}
                    value={message}
                />
                <div className="reject-modal__options">
                    <Button color="primary" disabled={message.length < 1} type="submit"
                            variant="contained" onClick={onSubmit.bind(null, message)}>
                        Подтвердить
                    </Button>
                    <Button color="info" type="button" variant="contained" onClick={onClose.bind(null)}>
                        Отменить
                    </Button>
                </div>
            </div>
        </Modal>
    )
};
