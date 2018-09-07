  /*===================================================================================*/
 /*                   					 M O D E L 				    				  */
/*===================================================================================*/
function monthModel() {
	var myView = null;
	this.nowDate = new Date();
/*-----------------------------------
	НАЗВАНИЕ МЕСЯЦЕВ
-----------------------------------*/
	this.monthName = [
	  'Январь', 'Февраль', 'Март', 'Апрель',
	  'Май', 'Июнь', 'Июль', 'Август',
	  'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
	];
/*-----------------------------------
	НАЗВАНИЕ ДНЕЙ НЕДЕЛИ
-----------------------------------*/
	this.dayName = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
/*-----------------------------------
	вЫБРАННАЯ ДАТА
-----------------------------------*/
	this.selectedDate = {
	  'Day' : null,
	  'Month' : null,
	  'Year' : null
	};
/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ MODEL
-----------------------------------*/
	this.init = function (view) {
		myView = view;
/*-----------------------------------
	СОЗДАЕМ КОНТРОЛЛЕР, КОТОРЫЙ ПОТОМ
	ИНИЦИАЛИЗИРУЕМ ЕГО 
------------------------------------*/	
		var Controller = new CalendarController ();
		Controller.init(this);
		this.updateModel(null);
	};
	
	this.updateModel = function (index) {
/*-----------------------------------
	ВЫЧИСЛЯЕМ ТЕКУЩУЮ ДАТУ (index == null)
-----------------------------------*/
		if (index == null) {
			this.selectedDate={
				'Day' : this.nowDate.getDate(),
				'Month' : this.nowDate.getMonth(),
				'Year' : this.nowDate.getFullYear()
			};
		}
/*-----------------------------------
	ВЫЧИСЛЯЕМ НУЖНУЮ НАМ ДАТУ 
-----------------------------------*/		
		else {
			var year = (this.selectedDate.Month+index>=0 & this.selectedDate.Month+index<12)?this.selectedDate.Year:(this.selectedDate.Year+index);
			var month = (this.selectedDate.Month+index>=0 & this.selectedDate.Month+index<12)?(this.selectedDate.Month+index):(index>0?0:11);
				this.selectedDate={
					'Day' : 1,
					'Month' : month,
					'Year' : year
				}
		}
/*-----------------------------------
	ВЫЧИСЛЯЕМ НУЖНУЮ НАМ ДАТУ 
-----------------------------------*/
		this.totalDays = 32 - new Date(this.selectedDate.Year, (this.selectedDate.Month), 32).getDate(); // ---- последний день месяца
		this.startDay = new Date(this.selectedDate.Year, this.selectedDate.Month, 1).getDay()-1; 	// ------------- начальный день недели месяца
		this.totalWeek = Math.ceil((this.totalDays+this.startDay)/7); // ------------------------------------- количество недель в месяце
		this.finalIndex=Math.ceil((this.totalDays+this.startDay)/7)*7;	// ------------------------------------- количество ячеек в таблице месяца
		myView.update(this.selectedDate.Year, this.selectedDate.Month,);
	}
	this.updateView = function (name) {
		if (myView) { 
			myView = null;
			if (name == 'month') {
				myView = new monthView(this);
			}
			else if (name == 'week') {
				myView = new weekView(this);
			}
			else if (name == 'day') {
				myView = new dayView(this);
			}
			myView.init(this);
		}
	}
	var V = new monthView();
	V.init(this);
}

  /*===================================================================================*/
 /*                   				   V I E W  - Month								  */
/*===================================================================================*/
function monthView() {
	var myModel = null;
	var myField = null;
/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ VIEW
-----------------------------------*/
	this.init = function (model) {
		myModel = model;
		myModel.init(this);
	};
/*-----------------------------------
	МЕТОД ПОСТРОЕНИЯ КАЛЕНДАРЯ (МЕСЯЦ)
-----------------------------------*/
	this.update = function (_year, _month) {
		var year = _year;
		var month =  _month;
/*-----------------------------------
	ЗАПИСЫВАЕМ ДАТУ В ШАПКЕ КАЛЕНДАРЯ
------------------------------------*/			
		var date = document.getElementById ('month-date');
		date.innerHTML = myModel.monthName[month] + ' ' + year;
/*-----------------------------------
	НАХОДИМ И ОБНУЛЯЕМ КОНТЕЙНЕР C
	КАЛЕНДАРЕМ, СОЗДАЕМ ПОЛЕ 
------------------------------------*/

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
//------------------------------------------------------//
//-----------------ВОТ ЭТО МЕСТО------------------------//
//------------------------------------------------------//
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//

		var container=document.getElementById ('view-container');
		container.innerHTML = '';

		myField = document.createElement('table');
		myField.id = 'month';
		container.appendChild(myField);

		var tbody = document.createElement('tbody');
		myField.appendChild(tbody);
/*-----------------------------------
	СОЗДАЕМ ЯЧЕЙКИ КАЛЕНДАРЯ
		day   - числа дней месяца
		index - количество ячеек в месяца, 
				включая пустые
------------------------------------*/
		var day = 1;
		var index = 0;
/*-----------------------------------
	СОЗДАЕМ СТРОКИ
------------------------------------*/	
		for (let i = 0; i <= myModel.totalWeek; i++) {
			var tr = document.createElement('tr');
			tbody.appendChild(tr);
/*-----------------------------------
	ЗАПОЛНЯЕМ ПЕРВУЮ СТРОКУ
	ДНЯМИ НЕДЕЛИ ИЗ МОДЕЛИ
------------------------------------*/	
			for (let j = 0; j < 7; j++) {
				var td = document.createElement('td');
				tr.appendChild(td);
				if ( i == 0 ) {				
					tr.className = 'dayName';
					td.innerHTML = myModel.dayName[j];
				};
/*-----------------------------------
	ЗАПОЛНЯЕМ КАЛЕНДАРЬ В ЗАВИСИМОСТИ 
	ОТ КОЛИЧЕСТВА ДНЕЙ
------------------------------------*/	
				if ( i > 0 ) {
					if (!(index < myModel.startDay) & !(index >= myModel.totalDays+myModel.startDay) & index < myModel.finalIndex ) {
						var div = document.createElement('div');
						td.appendChild(div);
						if (day == myModel.nowDate.getDate() & 
							month ==  myModel.nowDate.getMonth() &
							year == myModel.nowDate.getFullYear()) {
							td.className = "now-date";
						}
						div.innerHTML = day;
						day++;
					}
					index++;
	       		}
			}
		}		
	}
}

  /*===================================================================================*/
 /*                   				   V I E W  - Week								  */
/*===================================================================================*/
function weekView() {
	var myModel = null;
	var myField = null;
/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ MODEL
-----------------------------------*/
	this.init = function (model) {
		myModel = model;
		myModel.init(this);
	};
/*-----------------------------------
	МЕТОД ПОСТРОЕНИЯ КАЛЕНДАРЯ (Неделя)
-----------------------------------*/
	this.update = function (_year, _month) {
		var year = _year;
		var month =  _month;
/*-----------------------------------
	ЗАПИСЫВАЕМ ДАТУ В ШАПКЕ КАЛЕНДАРЯ
------------------------------------*/	
		var date = document.getElementById ('month-date');
		date.innerHTML = myModel.monthName[month] + ' ' + year;
/*-----------------------------------
	НАХОДИМ И ОБНУЛЯЕМ КОНТЕЙНЕР C
	КАЛЕНДАРЕМ, СОЗДАЕМ ПОЛЕ 
------------------------------------*/
		var container=document.getElementById ('view-container');
		container.innerHTML = '';

		myField = document.createElement('table');
		container.appendChild(myField);

		var tbody = document.createElement('tbody');
		myField.appendChild(tbody);
/*-----------------------------------
	СОЗДАЕМ ЯЧЕЙКИ КАЛЕНДАРЯ
		day   - числа дней месяца
		index - количество ячеек в месяца, 
				включая пустые
------------------------------------*/
		var day = myModel.selectedDate.Day;
		var index = 0;
/*-----------------------------------
	СОЗДАЕМ СТРОКИ
------------------------------------*/	
		for (let i = 0; i < 2; i++) {
			var tr = document.createElement('tr');
			tbody.appendChild(tr);
/*-----------------------------------
	СОЗДАЕМ СЛОЛБЦЫ КАЖДОЙ СТРОКИ
------------------------------------*/
			for (let j = 0; j < 7; j++) {
/*-----------------------------------
	ПЕРВАЯ СТРОКА - ДНИ НЕДЕЛИ ИЗ МОДЕЛИ
------------------------------------*/	
				var td = document.createElement('td');
				tr.appendChild(td);
				if ( i == 0 ) {	
					tr.className = 'dayName';		
					td.innerHTML = myModel.dayName[j];
				}
/*-----------------------------------
	ОСТАЛЬНЫЕ СТРОКИ - ЧИСЛА + МЕСЯЦ
------------------------------------*/				
				else {
					var div = document.createElement('div');
					td.appendChild(div);
					td.id = 'week';
					div.innerHTML = + ' ' +myModel.selectedDate.Day ;
					day++;
					index++;
				}
			}
		}		
	}
}
  /*===================================================================================*/
 /*                   				   V I E W  - Day								  */
/*===================================================================================*/
function dayView() {
	var myModel = null;
	var myField = null;
/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ MODEL
-----------------------------------*/
	this.init = function (model) {
		myModel = model;
		myModel.init(this);
	};
/*-----------------------------------
	МЕТОД ПОСТРОЕНИЯ КАЛЕНДАРЯ (Неделя)
-----------------------------------*/
	this.update = function (_year, _month) {
		var year = _year;
		var month =  _month;
/*-----------------------------------
	ЗАПИСЫВАЕМ ДАТУ В ШАПКЕ КАЛЕНДАРЯ
------------------------------------*/	
		var date = document.getElementById ('month-date');
		date.innerHTML = myModel.selectedDate.Day + ' ' + myModel.monthName[month] + ' ' + year;
/*-----------------------------------
	НАХОДИМ И ОБНУЛЯЕМ КОНТЕЙНЕР C
	КАЛЕНДАРЕМ, СОЗДАЕМ ПОЛЕ 
------------------------------------*/
		var container=document.getElementById ('view-container');
		container.innerHTML = '';

		myField = document.createElement('table');
		container.appendChild(myField);

		var tbody = document.createElement('tbody');
		myField.appendChild(tbody);
/*-----------------------------------
	СОЗДАЕМ ЯЧЕЙКИ КАЛЕНДАРЯ
		day   - числа дней месяца
		index - количество ячеек в месяца, 
				включая пустые
------------------------------------*/
		var day = myModel.selectedDate.Day;
		
		for (let i = 0; i <= 1; i++) {
			//--- заведем счетчик дней месяца (начиная с первого) 
			//--- после чего определим с какого дня начинаем и 
			//--- так до конца проставим дни месяца

			var tr = document.createElement('tr');
			if (i==0) {
				tr.className = 'dayName';
			}
			tbody.appendChild(tr);

			for (let j = 0; j < 1; j++) {

				if ( i == 0 ) {			
					var td = document.createElement('td');
					tr.appendChild(td);
					td.innerHTML = myModel.dayName[j];
				}
				else {
					var td = document.createElement('td');
					tr.appendChild(td);
							td.id = 'day';
					var div = document.createElement('div');
					td.appendChild(div);
	       		}
			}
		}		
	}

}
  /*===================================================================================*/
 /*                   			  C O N T R O L L E R 								  */
/*===================================================================================*/
function CalendarController() {
	
	var myModel = null;

	this.init = function (model) {
		myModel=model;

		var buttonBack = document.getElementById('back-but');
        buttonBack.addEventListener('click',this.setBack);

		var buttonNext = document.getElementById('next-but');
        buttonNext.addEventListener('click',this.setNext);

        var buttonNowDate = document.getElementById('today');
        buttonNowDate.addEventListener('click',this.setNowDate);

        var buttonMonth = document.getElementById('month-button');
        buttonMonth.addEventListener('click',this.setMonth);

        var buttonWeek = document.getElementById('week-button');
        buttonWeek.addEventListener('click',this.setWeek);

        var buttonDay = document.getElementById('day-button');
        buttonDay.addEventListener('click',this.setDay);
    }
   
    this.setBack = function() {
    	myModel.updateModel(-1) 
	}
    this.setNext = function() {
    	myModel.updateModel(+1) 
	}
	this.setNowDate = function () {
		myModel.updateModel(null);
	}
	this.setMonth = function() {
		myModel.updateView('month');
	}
	this.setWeek = function() {
		myModel.updateView('week');
	}
	this.setDay = function() {
		myModel.updateView('day');
	}
}
 var calendar = new monthModel();
