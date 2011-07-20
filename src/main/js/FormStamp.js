/*
 * Copyright 2011 Svoysh.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

(function() {
	var svoysh = window.svoysh;
	if (typeof svoysh === 'undefined') {
		svoysh = newSvoysh();
		window.svoysh = svoysh;
	}
	
	function newSvoysh() {var self = {
		// Stub.
	};return self;}
})();

svoysh.newFormStamp = function(formPrefix) {
	var self = {
		formPrefix: formPrefix,
		idPattern: /%id%/g,
		animationSpeed: "normal",

		formPatternHtml: null,
		$formBlock: null,
		$removeAllButton: null,

		rowCount: 0,
		currentRow: 0,

		init: function() {
			self.formPatternHtml = $("#" + self.formPrefix + "-pattern").html();

			var formBlockId = "#" + self.formPrefix + "-block";
			self.$formBlock = $(formBlockId);

			var removeAllButtonId = "#" + self.formPrefix + "-removeAllButton";
			var $removeAllButton = $(removeAllButtonId);
			if ($removeAllButton.length > 0) {
				self.$removeAllButton = $removeAllButton;
			}

			self.rowCount = self.countForms();
			self.currentRow = self.rowCount + 1;
		},

		countForms: function() {
			return self.$formBlock.children().length;
		},

		/**
		 * Create n copies of form.
		 * @param {Number} n Count of form copies to create.
		 */
		stamp: function(n) {
			if (typeof n === 'undefined') n = 1;

			if (n <= 0) return;

			if (n > 0 && self.rowCount <= 0) {
				self.showRemoveAllButton();
				self.rowCount = 0;
			}

			for (var i = 0; i < n; i++) {
				var newFormHtml = self.formPatternHtml.replace(self.idPattern, self.currentRow.toString());
				self.$formBlock.append(newFormHtml);

				var $removeButton = $("#" + self.formPrefix + "-removeButton-" + self.currentRow.toString());
				if ($removeButton.length > 0) {
					$removeButton.get(0).row = self.currentRow;
					$removeButton.click(function() {
						self.remove(this.row);
					});
				}

				$("#" + self.formPrefix + "-" + self.currentRow.toString()).fadeIn(self.animationSpeed);

				self.currentRow++;
				self.rowCount++;
			}
		},

		remove: function(id) {
			var sel = "#" + self.formPrefix + "-" + id.toString();
			$(sel).fadeOut(self.animationSpeed, function() {
				$(this).remove();
				if (self.rowCount > 0) {
					self.rowCount--;
				}

				/*
				 TODO: Maybe count children by ".PersonRow" class for faster
				 (need to add class to each row's div)? (yes)
				 like:
				 if (personCount <= 0 && $(".PersonRow").length <= 0) {...}
				 */
				if (self.rowCount <= 0 && self.countForms() <= 0) {
					self.hideRemoveAllButton();
					self.rowCount = 0;
				}
			});
		},

		removeAll: function() {
			self.$formBlock.fadeOut(self.animationSpeed, function() {
				$(this).empty().show();
				self.hideRemoveAllButton();
				self.rowCount = 0;
			});
		},

		hasRemoveAllButton: function() {
			return self.$removeAllButton !== null;
		},

		hideRemoveAllButton: function() {
			if (self.hasRemoveAllButton()) {
				self.$removeAllButton.hide();
			}
		},

		showRemoveAllButton: function() {
			if (self.hasRemoveAllButton()) {
				self.$removeAllButton.show();
			}
		}
	};
	self.init();
	return self;
};