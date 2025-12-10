import React, { useState } from 'react';
import { MANAGER_PASSWORD } from '../constants';
import Button from './Button';
import { Input } from './Input';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onConfirm, title = "Acesso de Gerenciador" }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === MANAGER_PASSWORD) {
      onConfirm();
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Senha incorreta. Acesso negado.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">
          Digite a senha de gerenciador para confirmar esta ação (1234).
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            type="password" 
            placeholder="Senha" 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            autoFocus
            error={error}
          />
          
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger">
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
