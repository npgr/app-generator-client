/**
 * Application Configuration (Plus table Config, load on UserController.login)
 * (sails.config.appConfig)
 *
 **/
 
module.exports.appConfig = {
  
	/** Client Side **/
	HMAC_KEY1 : 'IYSÑ(S][A()#FG[?=])])dihyb38d{´{}}',
	
	/** Server Side **/
	HMAC_KEY2 : 'oiuJT9398j)/&6303$#282365]DPJjuhgd',
	
	BROWSER: true,
	
	CLIENT_KEY: '',
	
	/** Pages that do not need login **/
	PAGES_WITHOUT_LOGIN: '/signup, other' // /db/import, /db/export
};