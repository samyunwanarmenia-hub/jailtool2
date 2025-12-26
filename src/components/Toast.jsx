import React, { useEffect } from 'react';

const Toast = () => {
  // Экспортируем функцию глобально для использования в других местах
  useEffect(() => {
    window.showToast = (message) => {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 3000);
      }
    };
  }, []);

  return (
    <div className="toast" id="toast"></div>
  );
};

export default Toast;