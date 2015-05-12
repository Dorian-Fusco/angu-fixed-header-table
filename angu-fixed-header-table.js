/**
 * AngularJS fixed header scrollable table directive
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.2.0
 */
(function () {angular.module('anguFixedHeaderTable', []).directive('fixedHeader', fixedHeader);

    fixedHeader.$inject = ['$timeout'];

    function fixedHeader($timeout) {
        return {
            restrict: 'A',
			scope: {tableData : '='},
            link: link
        };

        function link($scope, $elem, $attrs, $ctrl) 
		{
            var elem = $elem[0];
            $scope.$watch('tableData', function(newValue) 
			{
                if (Array.isArray(newValue)) 
				{
                    transformTable();
                }
            }, true);
			
            function transformTable() 
			{
                // reset display styles so column widths are correct when measured below
                //angular.element(elem.querySelectorAll('thead, tbody, tfoot')).css('display', '');

                // wrap in $timeout to give table a chance to finish rendering
                $timeout(function () 
				{
					//instead of doing any calculs on elem, we will do them on a clone of him !
					//This way we won't change the display of the table itself, thus not enabling / disabling scrolling (wich makes the cursor 'drop' the scrollbar)
					var clone = elem.cloneNode(true);
					var wrapper= document.createElement('div');
					wrapper.style.height = '0px';
					wrapper.style.overflow = 'hidden';
					wrapper.style.visibility = 'invisible';
					wrapper.appendChild(clone);
					angular.element(clone.querySelectorAll('thead, tbody, tfoot')).css('display', '');
					$elem.parent()[0].appendChild(wrapper);
                    // set widths of columns
                    angular.forEach(clone.querySelectorAll('tr:first-child th:not(:last-child)'), function (clonedThElem, i) 
					{
                        var clonedTdElems = clone.querySelector('table[fixed-header]>tbody tr:first-child th:nth-child(' + (i + 1) + '), table[fixed-header]>tbody tr:first-child td:nth-child(' + (i + 1) + ')');
                        var columnWidth = clonedTdElems ? clonedTdElems.offsetWidth : clonedThElem.offsetWidth;
                        var tdElems = elem.querySelector('table[fixed-header]>tbody tr:first-child th:nth-child(' + (i + 1) + '), table[fixed-header]>tbody tr:first-child td:nth-child(' + (i + 1) + ')');
                        var thElems = elem.querySelector('table[fixed-header]>thead tr:first-child th:nth-child(' + (i + 1) + '), table[fixed-header]>thead tr:first-child td:nth-child(' + (i + 1) + ')');
                        var tfElems = elem.querySelector('table[fixed-header]>tfoot tr:first-child th:nth-child(' + (i + 1) + '), table[fixed-header]>tfoot tr:first-child td:nth-child(' + (i + 1) + ')');
                        if (tdElems) 
						{
                            tdElems.style.width = columnWidth + 'px';
                            tdElems.style.minWidth = columnWidth + 'px';
                            tdElems.style.maxWidth = columnWidth + 'px';
                        }
                        if (thElems) 
						{
                            thElems.style.width = columnWidth + 'px';
                            thElems.style.minWidth = columnWidth + 'px';
                            thElems.style.maxWidth = columnWidth + 'px';
                        }
                        if (tfElems) 
						{
                            tfElems.style.width = columnWidth + 'px';
                            tfElems.style.minWidth = columnWidth + 'px';
                            tfElems.style.maxWidth = columnWidth + 'px';
                        }
                    });
					
					//Done with the math ! We can just get rid of the clone
					wrapper.remove();
					
                    // set css styles on thead and tbody
                    angular.element(elem.querySelectorAll('table[fixed-header]>thead, table[fixed-header]>tfoot')).css('display', 'block');
                    angular.element(elem.querySelector('table[fixed-header]>tbody')).css({
                        'display': 'block',
                        'height': 'inherit',
                        'overflow': 'auto'
                    });

                    // reduce width of last column by width of scrollbar
                    var tbody = elem.querySelector('table[fixed-header]>tbody');
					if($attrs.tableHeight !== undefined && tbody.clientHeight > $attrs.tableHeight)
					{
						tbody.style.height = $attrs.tableHeight + 'px';
					}
					else
					{
						tbody.style.height = 'inherit';
					}
                    var scrollBarWidth = tbody.offsetWidth - tbody.clientWidth;
                    var tBodyLastColumn = elem.querySelector('table[fixed-header]>tbody tr:first-child th:last-child, table[fixed-header]>tbody tr:first-child td:last-child');
					var tHeadLastColumn = elem.querySelector('table[fixed-header]>thead tr:first-child th:last-child, table[fixed-header]>thead tr:first-child td:last-child');
					var tFootLastColumn = elem.querySelector('table[fixed-header]>tfoot tr:first-child th:last-child, table[fixed-header]>tfoot tr:first-child td:last-child');
					if (scrollBarWidth > 0) 
					{
						if(tHeadLastColumn && tBodyLastColumn)
						{
							tHeadLastColumn.style.width = (tBodyLastColumn.offsetWidth + scrollBarWidth) + 'px';
						}
						if(tFootLastColumn && tBodyLastColumn)
						{
							tFootLastColumn.style.width = (tBodyLastColumn.offsetWidth + scrollBarWidth) + 'px';
						}
						if(tHeadLastColumn && tBodyLastColumn)
						{
							tBodyLastColumn.style.width = tHeadLastColumn.offsetWidth - scrollBarWidth + 'px';
						}
					}
					else
					{
						if(tHeadLastColumn && tBodyLastColumn)
						{
							tBodyLastColumn.style.width = tHeadLastColumn.offsetWidth + 'px';
						}
					}
                });
            }
        }
    }
})();
