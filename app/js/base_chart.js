var drawBarChart = function(data, chart_id, color){
  console.log(data);
  var parentWidth = $('#'+chart_id).parent().width();
  var parentHeight = $('#'+chart_id).parent().height();
  var margin = {top: parentHeight*0.3, right: parentWidth*0.02, bottom: parentHeight*0.02, left: parentWidth*0.02},
      width = parentWidth - margin.left - margin.right,
      height = parentHeight - margin.top - margin.bottom;

  var formatPercent = d3.format(".0%");

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(formatPercent);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>"+d.category+":</strong> <span style='color:red'>" + d.value + "</span>";
    })

  var svg = d3.select('#'+chart_id)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  console.log(d3.max(data, function(d) { return d.value; }));
  x.domain(data.map(function(d) { return d.category; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  /*svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", function() {
            return "rotate(-20)"
        })

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");*/

  var bars = svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .attr("y",function(d,i){ return height; })
      .attr("fill","#4985EA")
      .attr("height",0)
      .transition()
      .duration(2000)
      .ease("bounce")
      .delay(function(d,i){
          return i * 200;
      })
      .attr("x", function(d) { return x(d.category); })
      .attr("y", function(d) { return y(d.value) })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill",color)
      .attr("class", "bar");

  function type(d) {
    d.value = +d.value;
    return d;
  }


  d3.select("#sortBar").on("change", change);

  // var sortTimeout = setTimeout(function() {
  //   d3.select("input").property("checked", true).each(change);
  // }, 10000);

  function change() {
    // clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.value - a.value; }
        : function(a, b) { return d3.ascending(a.category, b.category); })
        .map(function(d) { return d.category; })).copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.category) - x0(b.category); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.category); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
}

var drawLiquidChart = function(data, chart_id){
  var config = liquidFillGaugeDefaultSettings();
      config.circleThickness = 0.15;
      config.circleColor = "#808015";
      config.textColor = "#555500";
      config.waveTextColor = "#FFFFAA";
      config.waveColor = "#AAAA39";
      config.textVertPosition = 0.8;
      config.waveAnimateTime = 2000;
      config.waveHeight = 0.05;
      config.waveAnimate = true;
      config.waveRise = false;
      config.waveHeightScaling = false;
      config.waveOffset = 0.45;
      config.textSize = 0.65;
      config.waveCount = 3;
  return loadLiquidFillGauge(chart_id, data, config);
}

var drawTreeChart = function(data, chart_id){
    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;
    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = $(document).width() * 0.95;
    // var viewerHeight = $(document).height();
    var viewerHeight = 350;
    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(data, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });


    // sort the tree according to the node names

    function sortTree() {
        tree.sort(function(a, b) {
            return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
    }
    // Sort the tree initially incase the JSON isn't in a sorted order.
    sortTree();

    // TODO: Pan function, can be better implemented.

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // Define the zoom function for the zoomable tree

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
        d3.select(domNode).attr('class', 'node activeDrag');

        svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
            if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
            else return -1; // a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
            // remove link paths
            links = tree.links(nodes);
            nodePaths = svgGroup.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                }).remove();
            // remove child nodes
            nodesExit = svgGroup.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id;
                }).filter(function(d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        // remove parent link
        parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup.selectAll('path.link').filter(function(d, i) {
            if (d.target.id == draggingNode.id) {
                return true;
            }
            return false;
        }).remove();

        dragStarted = null;
    }

    // define the baseSvg, attaching a class for styling and the zoomListener
    d3.select("#"+chart_id).selectAll("*").remove();
    var baseSvg = d3.select("#"+chart_id).append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);


    // Define the drag listeners for drag/drop behaviour of nodes.
    dragListener = d3.behavior.drag()
        .on("dragstart", function(d) {
            if (d == root) {
                return;
            }
            dragStarted = true;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
            if (d == root) {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            // get coords of mouseEvent relative to svg container to allow for panning
            relCoords = d3.mouse($('svg').get(0));
            if (relCoords[0] < panBoundary) {
                panTimer = true;
                pan(this, 'left');
            } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                panTimer = true;
                pan(this, 'right');
            } else if (relCoords[1] < panBoundary) {
                panTimer = true;
                pan(this, 'up');
            } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                panTimer = true;
                pan(this, 'down');
            } else {
                try {
                    clearTimeout(panTimer);
                } catch (e) {

                }
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
            updateTempConnector();
        }).on("dragend", function(d) {
            if (d == root) {
                return;
            }
            domNode = this;
            if (selectedNode) {
                // now remove the element from the parent, and insert it into the new elements children
                var index = draggingNode.parent.children.indexOf(draggingNode);
                if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                }
                if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                    if (typeof selectedNode.children !== 'undefined') {
                        selectedNode.children.push(draggingNode);
                    } else {
                        selectedNode._children.push(draggingNode);
                    }
                } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                }
                // Make sure that the node being added to is expanded so user can see added node is correctly moved
                expand(selectedNode);
                sortTree();
                endDrag();
            } else {
                endDrag();
            }
        });

    function endDrag() {
        selectedNode = null;
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        d3.select(domNode).attr('class', 'node');
        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
        updateTempConnector();
        if (draggingNode !== null) {
            update(root);
            centerNode(draggingNode);
            draggingNode = null;
        }
    }

    // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    var overCircle = function(d) {
        selectedNode = d;
        updateTempConnector();
    };
    var outCircle = function(d) {
        selectedNode = null;
        updateTempConnector();
    };

    // Function to update the temporary connector indicating dragging affiliation
    var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 5;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        // centerNode(d);
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .call(dragListener)
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        // phantom node to give us mouseover in a radius around it
        nodeEnter.append("circle")
            .attr('class', 'ghostCircle')
            .attr("r", 30)
            .attr("opacity", 0.2) // change this to zero to hide the target area
        .style("fill", "red")
            .attr('pointer-events', 'mouseover')
            .on("mouseover", function(node) {
                overCircle(node);
            })
            .on("mouseout", function(node) {
                outCircle(node);
            });

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("r", 4.5)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    // Define the root
    root = data;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // Layout the tree initially and center on the root node.
    update(root);
    centerNode(root);
}


var draw_2lines_datekey = function(data, targets, svg_id, linecolor, dotcolor){
    var svg = d3.select('#'+svg_id);
    var parentWidth = $('#'+svg_id).parent().width();
    var parentHeight = $('#'+svg_id).parent().height();
    var width_svg = parentWidth,height_svg = parentHeight;
    var margin = {top: parentHeight*0.1, right: parentWidth*0.05, bottom: parentHeight*0.1, left: parentWidth*0.12};
    var width = width_svg - margin.left - margin.right;
    var height = height_svg - margin.top - margin.bottom;

    svg.attr("width", '100%').attr("height", height_svg);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-6, 0]);
    svg.call(tip);

    var target1 = targets[0].target;
    // var target2 = targets[1].target;

    var parseDate = d3.time.format("%Y%m").parse;
    data.forEach(function(d) {
        d.dateKey = parseDate(d.dateKey);
        d[target1] = +d[target1];
        // d[target2] = +d[target2];
    });

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(function(d) {
            return d3.time.format("%Y%m")(new Date(d));
        });

    if(data.length<10){
        var xAxisValue = [];
        for(var i=0;i<data.length;i++){
            xAxisValue.push(data[i].dateKey);
        }
        xAxis.tickValues(xAxisValue);
    }

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line1 = d3.svg.line()
        .x(function(d){return x(d.dateKey);})
        .y(function(d){return y(d[target1]);});

    // var line2 = d3.svg.line()
    //     .x(function(d){return x(d.dateKey);})
    //     .y(function(d){return y(d[target2]);});

    x.domain(d3.extent(data, function(d) { return d.dateKey; }));
    y.domain([0, d3.max(data, function(d) { return d[target1]; }) * 1.5]);


    svg.append("path")
        .datum(data)
        .attr("transform","translate("+margin.left+","+margin.top+")")
        .attr("class", linecolor)
        .attr("d", line1);

    // svg.append("path")
    //     .datum(data)
    //     .attr("transform","translate("+margin.left+","+margin.top+")")
    //     .attr("class", linecolor)
    //     .attr("d", line2);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform","translate("+margin.left+","+margin.top+")")
        .call(yAxis)
        .selectAll("text")
        .style("fill", '#666')
        .style('font-size', 7);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+margin.left+","+(height + margin.top)+")")
        .call(xAxis)
        .selectAll("text")
        .style("fill", '#666')
        .style('font-size', 7);
        // .attr("transform", function(){
        //     return "rotate(-30)"
        // });
        // .attr("transform","translate(20,0)");

    //add points
    var g = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('g')
        .append('circle')
        .attr('class', dotcolor)
        .attr('cx', line1.x())
        .attr('cy', line1.y())
        .attr('r', 2.5)
        .attr("transform", "translate("+margin.left+","+margin.top+")")
        .on('mouseover', function(d) {
            d3.select(this).transition().duration(500).attr('r', 4);
            var html = "<ul>" +
                "<li>日期："+ d3.time.format("%Y-%m")(d.dateKey) + "</li>" +
                "<li>"+targets[0].des+"："+ d[target1] + "</li>" +
                "</ul>";
            tip.html(html);
            tip.show();
        })
        .on('mouseout', function() {
            d3.select(this).transition().duration(500).attr('r', 2.5);
            tip.hide();
        });

    // var g = svg.selectAll('circle1')
    //     .data(data)
    //     .enter()
    //     .append('g')
    //     .append('circle')
    //     .attr('class', 'redlinecircle')
    //     .attr('cx', line2.x())
    //     .attr('cy', line2.y())
    //     .attr('r', 2.5)
    //     .attr("transform", "translate("+margin.left+","+margin.top+")")
    //     .on('mouseover', function(d) {
    //         d3.select(this).transition().duration(500).attr('r', 4);
    //         var html = "<ul>" +
    //             "<li>日期："+ d3.time.format("%Y-%m-%d")(d.dateKey) + "</li>" +
    //             "<li>"+targets[1].des+"："+ d[target2] + "</li>" +
    //             "</ul>";
    //         tip.html(html);
    //         tip.show();
    //     })
    //     .on('mouseout', function() {
    //         d3.select(this).transition().duration(500).attr('r', 2.5);
    //         tip.hide();
    //     });

    // svg.append("g").append("rect")
    //     .attr("x",width_svg * 0.25)
    //     .attr("y",height_svg * 0.98)
    //     .attr("width",10)
    //     .attr("height",10)
    //     .attr("fill", "#69c5ff");

    // svg.append("g").append("text")
    //     .attr("x", width_svg * 0.26 + 10)
    //     .attr("y",height_svg * 0.965)
    //     .attr('style','font-family:Microsoft Yahei; font-size:12px;')
    //     .attr("fill", "#69c5ff")
    //     .text(targets[0].des);


    // svg.append("g").append("rect")
    //     .attr("x",width_svg * 0.55)
    //     .attr("y",height_svg * 0.93)
    //     .attr("width",10)
    //     .attr("height",10)
    //     .attr("fill", "#FF9D6F");

    // svg.append("g").append("text")
    //     .attr("x", width_svg * 0.56 + 10)
    //     .attr("y",height_svg * 0.965)
    //     .attr('style','font-family:Microsoft Yahei; font-size:12px;')
    //     .attr("fill", "#FF9D6F")
    //     .text(targets[1].des);

}

var drawDonut3d = function(svg_id){
  var salesData=[
  {label:"Basic", color:"#3366CC"},
  {label:"Plus", color:"#DC3912"},
  {label:"Lite", color:"#FF9900"},
  {label:"Elite", color:"#109618"},
  {label:"Delux", color:"#990099"}
  ];

  var parentWidth = $('#'+svg_id).parent().width();
  var parentWidth = $('#'+svg_id).parent().width();

  var svg = d3.select("#"+svg_id).attr("width",parentWidth).attr("height",parentWidth);

  svg.append("g").attr("id","salesDonut");
  svg.append("g").attr("id","quotesDonut");

  Donut3D.draw("salesDonut", randomData(), 150, 150, 130, 100, 30, 0.4);
  Donut3D.draw("quotesDonut", randomData(), 450, 150, 130, 100, 30, 0);
    
  function changeData(){
    Donut3D.transition("salesDonut", randomData(), 130, 100, 30, 0.4);
    Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
  }

  function randomData(){
    return salesData.map(function(d){ 
      return {label:d.label, value:1000*Math.random(), color:d.color};});
  }

}
var drawPie = function(svg_id){
  var data = [{drugType: '中药', value:5}, {drugType: '中成药', value:3}, {drugType: '西药', value:2}];
  var parentWidth = $('#'+svg_id).parent().width();
  var parentHeight = $('#'+svg_id).parent().height();
  var width = parentWidth*0.9,height = parentHeight*0.9,radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
    .range(["#10a0de", "#7bcc3a", "#ffd162"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - parentHeight/15)
      .innerRadius(20);

  var labelArc = d3.svg.arc()
      .outerRadius(radius - 35)
      .innerRadius(radius - 35);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.value; });

  var svg = d3.select("#"+svg_id)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");  


  var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.drugType); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.drugType; });  
}


