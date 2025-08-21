/**
 * Utilitário para gerenciamento de cookies
 */

/**
 * Define um cookie
 * @param {string} name - Nome do cookie
 * @param {string} value - Valor do cookie
 * @param {number} days - Dias para expiração (opcional)
 * @param {object} options - Opções adicionais (path, domain, secure, sameSite)
 */
export function setCookie(name, value, days = 7, options = {}) {
  let expires = '';
  
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  const {
    path = '/',
    domain = '',
    secure = false,
    sameSite = 'Lax'
  } = options;
  
  let cookieString = `${name}=${encodeURIComponent(value)}${expires}; path=${path}`;
  
  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += '; secure';
  cookieString += `; SameSite=${sameSite}`;
  
  document.cookie = cookieString;
}

/**
 * Obtém o valor de um cookie
 * @param {string} name - Nome do cookie
 * @returns {string|null} - Valor do cookie ou null se não encontrado
 */
export function getCookie(name) {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  
  return null;
}

/**
 * Remove um cookie
 * @param {string} name - Nome do cookie
 * @param {string} path - Caminho do cookie (opcional)
 * @param {string} domain - Domínio do cookie (opcional)
 */
export function removeCookie(name, path = '/', domain = '') {
  let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  
  document.cookie = cookieString;
}

/**
 * Verifica se um cookie existe
 * @param {string} name - Nome do cookie
 * @returns {boolean} - true se o cookie existe, false caso contrário
 */
export function cookieExists(name) {
  return getCookie(name) !== null;
}
