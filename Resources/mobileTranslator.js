var mobileTranslator = {

	database: {
		db: null,
	
		init: function() {
			db = Titanium.Database.open('mobileTranslator');
			db.execute('CREATE TABLE IF NOT EXISTS TRANSLATIONS (INPUTTEXT TEXT, INPUTLANGUAGE TEXT, OUTPUTTEXT TEXT, OUTPUTLANGUAGE TEXT, CREATIONDATE INTEGER)');
		},
		
		insertTranslation: function(inputText, inputLanguage, outputText, outputLanguage) {
			var now = new Date();
			db.execute('INSERT INTO TRANSLATIONS (INPUTTEXT, INPUTLANGUAGE, OUTPUTTEXT, OUTPUTLANGUAGE, CREATIONDATE) VALUES(?,?,?,?,?)', inputText, inputLanguage, outputText, outputLanguage, now.getTime());
		},
		
		getTranslations: function() {
			var data = [];
			var result = db.execute('SELECT * FROM TRANSLATIONS ORDER BY CREATIONDATE DESC');

			while (result.isValidRow()) {
				data.push({
					hasChild: false,
					title: result.fieldByName('INPUTTEXT'),
					image: 'images/' + result.fieldByName('OUTPUTLANGUAGE') + '.png',
					language: result.fieldByName('INPUTLANGUAGE') + '->' + result.fieldByName('OUTPUTLANGUAGE'),
					inputText: result.fieldByName('INPUTTEXT'),
					outputText: result.fieldByName('OUTPUTTEXT')
				});    
				result.next();
			}
			result.close();
			
			return data;
		}
	},
	
	translator: {
	
		languages: ['ALBANIAN','ARABIC','BELARUSIAN','BULGARIAN','CATALAN','CHINESE','CHINESE_SIMPLIFIED','CHINESE_TRADITIONAL','CROATIAN','CZECH','DANISH','DUTCH','ENGLISH','ESTONIAN','FILIPINO','FINNISH','FRENCH','GALICIAN','GERMAN','GREEK','HEBREW','HINDI','HUNGARIAN','ICELANDIC','INDONESIAN','IRISH','ITALIAN','JAPANESE','KOREAN','LATVIAN','LITHUANIAN','MACEDONIAN','MALAY','MALTESE','NORWEGIAN','PERSIAN','POLISH','PORTUGUESE','ROMANIAN','RUSSIAN','SERBIAN','SLOVAK','SLOVENIAN','SPANISH','SWEDISH','THAI','TURKISH','UKRAINIAN','VIETNAMESE','WELSH'],
	
		init: function() {
			google.load("language", "1");
			//google.setOnLoadCallback(function() {
			//	var code;
			//	for (var language in google.language.Languages) {
			//		code = google.language.Languages[language];
			//		if(google.language.isTranslatable(code)) {
			//			mobileTranslator.translator.languages.push(language);
			//		}
			//	}
			//});
		},
	
		getSupportedLanguages: function() {
			return this.languages;
		},
		
		getLanguage: function(index) {
			var language = this.languages[index];
			return google.language.Languages[language];
		},
		
		detectLanguage: function(text, callback) {
			google.language.detect(text, callback);
		},
	
		translate: function(text, inputLanguage, outputLanguage, callback) {
			google.language.translate(text, inputLanguage, outputLanguage, callback);
		}
	}
};