/*extern $, $$ */
var Memo = function () {
	var images = [
		"images/1.jpg",
		"images/2.jpg",
		"images/3.jpg",
		"images/4.jpg",
		"images/5.jpg",
		"images/6.jpg",
		"images/7.jpg",
		"images/8.jpg"
	];
	var listItems = [];
	var cardImages = [];
	var noOfMatches = null;
	var matchesLeft = 0;
	var currentImage = null;
	var secondsTimer = null;
	var keyTimer = null;
	var keyClearTimer = null;
	return {
		timer : null,
		noOfSeconds : 0,
		previousKey : null,
		init : function () {
			window.moveTo((screen.width / 2) - (window.innerWidth / 2), 50);
			var cards = $("#cards");
			for (var i=(images.length - 1); i>=0; i--) {
				images.push(images[i]);
			}
			for (var j=0, jl=images.length, listItem; j<jl; j++) {
				listItem = cards.create("li", null, true);
				listItem.create("span", null, true, (j + 1).toString());
				listItem.create("img", null, true);
				listItems.push(listItem);
			}
			cardImages = cards.cssSelect("img");
			noOfMatches = $$("no-of-matches");
			this.setSrc();
			$(document).addEvent("keyup", this.checkKey);
			$(".start-over").addEvent("click", Memo.setSrc);
		},
		
		setSrc : function () {
			$("#you-made-it").setStyle("display", "none");
			matchesLeft = images.length / 2;
			images.sort(function () {
				return Math.round(Math.random()) - 0.5;
			});
			for (var i=0, il=cardImages.length, image; i<il; i++) {
				image = cardImages[i];
				listItems[i].addEvent("click", Memo.showImage);
				image.src = images[i];
				image.setStyle("visibility", "hidden");
			}
			noOfMatches.replaceContent(matchesLeft.toString());
			Memo.noOfSeconds = 0;
			Memo.startTimer();
		},
		
		showImage : function () {
			var img = $(this).cssSelect("img")[0];
			img.setStyle("visibility", "visible");
			if (currentImage && img !== currentImage) {
				if (currentImage.src === img.src) {
					currentImage.parentNode.removeEvent("click", Memo.showImage);
					this.removeEvent("click", Memo.showImage);
					noOfMatches.replaceContent(String(--matchesLeft));
				}
				else {
					setTimeout(function (currentImage, img) {
						return function () {
							currentImage.setStyle("visibility", "hidden");
							img.setStyle("visibility", "hidden");
						};
					}(currentImage, img), 1000);
				}
				currentImage = null;
			}
			else {
				currentImage = img;
			}
			if (matchesLeft === 0) {
				$("#you-made-it").setStyle("display", "block");
				$("#total-time").replaceContent(Memo.timer.innerHTML);
				clearInterval(secondsTimer);
			}
		},
		
		startTimer : function () {
			clearInterval(secondsTimer);
			this.timer = $$("timer");
			this.timer.replaceContent("0 seconds");
			secondsTimer = setInterval(function() {
				var memoObj = Memo;
				var seconds = ++memoObj.noOfSeconds;
				var minutes = "";
				if (seconds >= 60) {
					var tempSeconds = seconds % 60;
					minutes = (seconds - tempSeconds) / 60;
					minutes = minutes + " minute" + ((minutes > 1)? "s" : "") + ", ";
					seconds = tempSeconds;
				}
				memoObj.timer.replaceContent(minutes + seconds + " seconds");
			}, 1000);
		},
		
		checkKey : function (evt) {
			clearTimeout(keyClearTimer);
			var keyCode = evt.keyCode;
			var keyNumber = null;
			switch (keyCode) {
				case 48:
					keyNumber = 0;
					break;
				case 49:
					keyNumber = 1;
					break;
				case 50:
					keyNumber = 2;
					break;
				case 51:
					keyNumber = 3;
					break;
				case 52:
					keyNumber = 4;
					break;
				case 53:
					keyNumber = 5;
					break;
				case 54:
					keyNumber = 6;
					break;
				case 55:
					keyNumber = 7;
					break;
				case 56:
					keyNumber = 8;
					break;
				case 57:
					keyNumber = 9;
					break;
			}
			if (typeof keyNumber === "number") {
				clearTimeout(keyTimer);
				if (typeof Memo.previousKey === "number") {
					keyNumber = parseInt(Memo.previousKey.toString() + keyNumber.toString(), 10);
				}
				Memo.previousKey = keyNumber;
				keyNumber--;
				if (keyNumber < images.length) {
					keyTimer = setTimeout(function (index) {
						return function () {
							Memo.showImage.call(listItems[index]);
						};
					}(keyNumber), 500);
				}
				keyClearTimer = setTimeout(function () {
					Memo.previousKey = null;
				}, 500);
			}
			else {
				Memo.previousKey = null;
			}
		}
	};
}();
Memo.init();