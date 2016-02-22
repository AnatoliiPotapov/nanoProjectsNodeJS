(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
///<reference path="./definitions/d3.d.ts" />
var Projects = require('./modules/ProjectArray');
var ProjectManager = require('./modules/ProjectManager');
var SVG_graph = require('./modules/Svg');
function Init(data) {
    var Vis = new SVG_graph(15000, 15000, ".vis");
    console.log(Vis);
    var NanoProjects = new Projects(Vis.svg, data);
    return [NanoProjects, Vis];
}
window.Init = Init;
window.ProjectManager = ProjectManager;

},{"./modules/ProjectArray":9,"./modules/ProjectManager":10,"./modules/Svg":12}],2:[function(require,module,exports){
///<reference path="./../definitions/jquery.d.ts" />
// default target is ".paths"
var Breadcrumbs = (function () {
    function Breadcrumbs(targetParentElement, goToFunction) {
        this.targetParentElement = targetParentElement;
        this.goToFunction = goToFunction;
    }
    Breadcrumbs.prototype.UpdatePath = function (path) {
        $(".breadcrumb-mode").empty();
        path.forEach(function (item) {
            $(".breadcrumb-mode").append('<li class="pathc"><a href="#">' + item + '</a></li>');
        });
    };
    return Breadcrumbs;
})();
module.exports = Breadcrumbs;

},{}],3:[function(require,module,exports){
var Layout = (function () {
    function Layout(projects) {
        this.svg = projects.parentSvgElement;
        this.UpdateMetaLayout(projects);
    }
    Layout.prototype.GetAlpha = function (Rlayout, Rout) {
        return 4 * Math.asin(0.5 * Rout / Rlayout);
    };
    Layout.prototype.GetPosition = function (start, R, alpha) {
        var x = start[0] + R * Math.cos(alpha);
        var y = start[1] + R * Math.sin(alpha);
        return [x, y];
    };
    Layout.prototype.CalculatePosition = function (rootIndex) {
        // initialise if main node
        if (rootIndex == 0) {
            this.metaLayout[rootIndex].cx = 0.0;
            this.metaLayout[rootIndex].cy = 0.0;
        }
        var position = [this.metaLayout[rootIndex].cx, this.metaLayout[rootIndex].cy];
        var R = this.metaLayout[rootIndex].Rout;
        var alpha = 0.0;
        var delta = 0.0;
        if (this.metaLayout[rootIndex].childrens.length > 1) {
            delta = 2 * Math.PI;
            for (var i = 0; i < this.metaLayout[rootIndex].childrens.length; i++) {
                var nodeIndex = this.metaLayout[rootIndex].childrens[i];
                var nodeOuterR = this.metaLayout[nodeIndex].Rout + this.metaLayout[nodeIndex].RchMax;
                var alphaIncr = this.GetAlpha(this.metaLayout[rootIndex].Rout, nodeOuterR);
                delta = delta - alphaIncr;
            }
            delta = delta / this.metaLayout[rootIndex].childrens.length;
        }
        for (var i = 0; i < this.metaLayout[rootIndex].childrens.length; i++) {
            var nodeIndex = this.metaLayout[rootIndex].childrens[i];
            var nodeOuterR = this.metaLayout[nodeIndex].Rout + this.metaLayout[nodeIndex].RchMax;
            var alphaIncr = this.GetAlpha(this.metaLayout[rootIndex].Rout, nodeOuterR);
            alpha = alpha + 0.5 * alphaIncr;
            var nodePosition = this.GetPosition(position, R, alpha);
            alpha = alpha + 0.5 * alphaIncr;
            alpha = alpha + delta;
            this.metaLayout[nodeIndex].cx = nodePosition[0];
            this.metaLayout[nodeIndex].cy = nodePosition[1];
            this.CalculatePosition(nodeIndex);
        }
    };
    Layout.prototype.CalclulateRout = function (index, innerCoef, outerCoef) {
        var metaProject = this.metaLayout[index];
        if (metaProject.childrens.length == 0) {
            // means the project is terminal
            return [metaProject.R, 0];
        }
        else {
            // means that we need to calculate Rout of all child nodes
            var RoutMax = 0;
            var Rsum = 0;
            for (var i = 0; i < metaProject.childrens.length; i++) {
                var get = this.CalclulateRout(metaProject.childrens[i], innerCoef, outerCoef);
                var Rout = get[0] + get[1];
                Rsum = Rsum + Rout;
                if (Rout > RoutMax)
                    RoutMax = Rout;
            }
            var Rlayout = innerCoef * Math.max(Rsum / Math.PI, metaProject.R + RoutMax);
            return [Rlayout, outerCoef * RoutMax];
        }
    };
    Layout.prototype.ChangeLayout = function (projects) {
    };
    Layout.prototype.UpdateMetaLayout = function (projects) {
        // initialising metaLayout
        this.metaLayout = new Array;
        var nodes = projects.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var childrens = projects.FindChildrensIndexes(nodes[i].name);
            this.metaLayout.push({
                name: nodes[i].name,
                R: nodes[i].currentPosition.r,
                Rout: undefined,
                RchMax: undefined,
                cx: undefined,
                cy: undefined,
                childrens: childrens
            });
        }
        this.GetNodesPosition();
    };
    Layout.prototype.GetNodesPosition = function () {
        for (var i = 0; i < this.metaLayout.length; i++) {
            var metaR = this.CalclulateRout(i, 1.1, 1.1);
            this.metaLayout[i].Rout = metaR[0], this.metaLayout[i].RchMax = metaR[1];
        }
        ;
        // calculate Position
        this.CalculatePosition(0);
        var output = new Array;
        for (var i = 0; i < this.metaLayout.length; i++) {
            output.push([this.metaLayout[i].cx, this.metaLayout[i].cy]);
        }
        return output;
    };
    return Layout;
})();
module.exports = Layout;

},{}],4:[function(require,module,exports){
///<reference path="./../definitions/jquery.d.ts" />
var Sys = require('./Sys');
// default target is ".paths"
function UpdateLegend(mode) {
    $(".legend-status-mode").empty();
    console.log(Sys.STATUSES);
    Sys.STATUSES.forEach(function (item) {
        $(".legend-status-mode").append('<div class="legend">' + '<div class="foo ' + item[1] + '"></div>' + '<lable>' + item[0] + '</lable>' + '</div>');
    });
    $(".legend-shares-mode").empty();
    mode.forEach(function (item) {
        $(".legend-shares-mode").append('<div class="legend">' + '<div class="foo ' + item[1] + '"></div>' + '<lable>' + item[0] + '</lable>' + '</div>');
    });
}
module.exports = UpdateLegend;

},{"./Sys":13}],5:[function(require,module,exports){
var Render = require('./Render');
var Vector = require('./Math');
var Link = (function () {
    function Link(nodes, parentSvgElement, type) {
        this.nodes = nodes;
        this.parentSvgElement = parentSvgElement;
        this.linkRender = new Render.Link(parentSvgElement, type);
    }
    Link.prototype.Update = function () {
        if (this.nodes[0].visibility == true && this.nodes[1].visibility == true) {
            this.linkRender.Remove();
            var vLink = new Vector(this.nodes[0].currentPosition.cx - this.nodes[1].currentPosition.cx, this.nodes[0].currentPosition.cy - this.nodes[1].currentPosition.cy);
            var vBase = vLink.Norm();
            var pointFrom = new Vector(this.nodes[0].currentPosition.cx, this.nodes[0].currentPosition.cy);
            var pointTo = new Vector(this.nodes[1].currentPosition.cx, this.nodes[1].currentPosition.cy);
            var mn = 0.8;
            var Radiuses = [this.nodes[0].currentPosition.r * mn, this.nodes[1].currentPosition.r * mn];
            var newPointFrom = vBase.Mult(Radiuses[0]).Negative().Sum(pointFrom);
            var newPointTo = vBase.Mult(Radiuses[1]).Sum(pointTo);
            this.linkRender.Draw([newPointFrom.x, newPointFrom.y], [newPointTo.x, newPointTo.y]);
        }
        else {
            this.linkRender.Remove();
        }
    };
    return Link;
})();
module.exports = Link;

},{"./Math":7,"./Render":11}],6:[function(require,module,exports){
var Link = require('./Link');
var LinkArray = (function () {
    function LinkArray(layout, projects, svg) {
        this.layout = layout;
        this.projects = projects;
        this.parentSvgElement = svg;
        this.links = [];
        // Setup
        var layout = this.layout.metaLayout;
        var projects = this.projects.nodes;
        for (var i = 0; i < layout.length; i++) {
            if (layout[i].childrens !== []) {
                var childrens = layout[i].childrens;
                for (var j = 0; j < childrens.length; j++) {
                    var k = childrens[j];
                    this.links.push(new Link([projects[i], projects[k]], this.parentSvgElement, "parent"));
                }
            }
        }
        for (var i = 0; i < projects.length; i++) {
            var node = projects[i];
            var partner = node.data.partner1;
            if (partner !== "") {
                var toNode = this.projects.FindByName(partner);
                this.links.push(new Link([node, toNode], this.parentSvgElement, "partner"));
            }
            var partner = node.data.partner2;
            if (partner !== "") {
                var toNode = this.projects.FindByName(partner);
                this.links.push(new Link([node, toNode], this.parentSvgElement, "partner"));
            }
            var partner = node.data.partner3;
            if (partner !== "") {
                var toNode = this.projects.FindByName(partner);
                this.links.push(new Link([node, toNode], this.parentSvgElement, "partner"));
            }
        }
        this.Update();
    }
    LinkArray.prototype.Update = function () {
        for (var i = 0; i < this.links.length; i++) {
            this.links[i].Update();
        }
    };
    return LinkArray;
})();
module.exports = LinkArray;

},{"./Link":5}],7:[function(require,module,exports){
var Vector = (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.Negative = function () {
        return new Vector(-this.x, -this.y);
    };
    Vector.prototype.Sum = function (incr) {
        return new Vector(this.x + incr.x, this.y + incr.y);
    };
    Vector.prototype.Norm = function () {
        var module = Math.sqrt(this.x * this.x + this.y * this.y);
        return new Vector(this.x / module, this.y / module);
    };
    Vector.prototype.Mult = function (scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    };
    return Vector;
})();
module.exports = Vector;

},{}],8:[function(require,module,exports){
///<reference path="./../definitions/jquery.d.ts" />
var Render = require('./Render');
var Sys = require('./Sys');
var Project = (function () {
    function Project(parent, data) {
        console.log(data);
        this.svgParent = parent;
        // инициализируем данные
        this.data = data;
        this.name = data.name;
        this.parent = data.parent;
        this.type = Sys.excludeSpaces(data.type);
        this.status = Sys.excludeSpaces(data.status);
        this.currentPosition = { "cx": data.position[0], "cy": data.position[1], "r": data.position[2] };
        this.star = (Math.random() > 0.8);
        this.visibility = true;
    }
    Project.prototype.Render = function () {
        // создаем вершину
        this.svgElement = this.svgParent.append("g").attr("class", "project").attr("name", this.name).attr("parent", this.parent).attr("type", this.type).attr("status", this.status).attr("title", this.name).attr("transform", "translate(" + (this.currentPosition.cx) + "," + (this.currentPosition.cy) + ")");
        this.starInstance = new Render.Star(this.svgElement);
        // создаем pie
        this.svgShares = new Render.ProjectPieChart(this.svgElement, this.data.share, Sys.SHARES_NAMES.share, 0.8 * this.currentPosition.r);
        // создаем кольцо статуса
        this.statusRing = new Render.ProjectStatusRing(this.svgElement, 0.8 * this.currentPosition.r, 0.84 * this.currentPosition.r, this.status);
        this.health1 = new Render.Health(this.svgElement, 0.9 * this.currentPosition.r, 1.0 * this.currentPosition.r, Math.random());
        // создаем текстовое поле
        this.textLabel = new Render.ProjectLabel(this.svgElement, this.currentPosition.r, this.data);
    };
    Project.prototype.GetPersentFromMode = function (sharesMode) {
        var persent;
        if (sharesMode === "Доли") {
            persent = (this.data.share[0] + this.data.share[1]) / (this.data.share.reduce(function (a, b) {
                return a + b;
            }));
        }
        if (sharesMode === "Деньги") {
            persent = (this.data.money[0]) / (this.data.money.reduce(function (a, b) {
                return a + b;
            }));
        }
        if (sharesMode === "CapexOpex") {
            persent = (this.data.capexopex[0]) / (this.data.capexopex.reduce(function (a, b) {
                return a + b;
            }));
        }
        //console.log(persent);
        if ((persent == 0) || (isNaN(persent)))
            persent = "";
        else
            persent = (persent * 100.0).toFixed(2).toString() + "%";
        return persent;
    };
    Project.prototype.GetSharesFromMode = function (sharesMode) {
        var output = { names: [], data: [] };
        if (sharesMode === "Доли") {
            output.names = Sys.SHARES_NAMES.share;
            output.data = this.data.share;
        }
        if (sharesMode === "Деньги") {
            output.names = Sys.SHARES_NAMES.money;
            output.data = this.data.money;
        }
        if (sharesMode === "CapexOpex") {
            output.names = Sys.SHARES_NAMES.capexopex;
            output.data = this.data.capexopex;
        }
        if (sharesMode === "ТипыПроектов") {
            output.names = ["type " + this.type];
            output.data = [1];
        }
        return output;
    };
    Project.prototype.SetRadiusFromMode = function (positionMode) {
        if (positionMode === 1) {
            this.currentPosition = {
                "r": this.data.position[2]
            };
        }
        if (positionMode === 2) {
            this.currentPosition = {
                "r": this.data.position[5]
            };
        }
        if (this.currentPosition.r < 10) {
            this.currentPosition.r = 10;
        }
    };
    Project.prototype.Hide = function () {
        this.svgElement = this.svgElement.style("visibility", "hidden");
        this.visibility = false;
    };
    Project.prototype.Show = function () {
        this.svgElement = this.svgElement.style("visibility", "visible");
        this.visibility = true;
    };
    Project.prototype.Remove = function () {
        this.svgElement = this.svgElement.remove();
        this.visibility = false;
    };
    Project.prototype.SetMode = function (textMode, sharesMode, displayStar) {
        this.displayStar = displayStar;
        this.starInstance.SetDisplayMode(displayStar);
        // обновляем текст
        var text = new Array;
        text.push(this.name);
        if (textMode.indexOf("Сумма") >= 0) {
            var moneyAmount = this.data.money.reduce(function (a, b) {
                return a + b;
            });
            if (moneyAmount == 0)
                text.push(" --- ");
            else
                text.push(this.data.money.reduce(function (a, b) {
                    return a + b;
                }).toFixed(2).toString());
        }
        ;
        if (textMode.indexOf("Процент") >= 0) {
            text.push(this.GetPersentFromMode(sharesMode));
        }
        ;
        this.textLabel.SetText(text);
        // обновляем доли
        var newShares = this.GetSharesFromMode(sharesMode);
        this.svgShares.SetProperty(newShares.data, newShares.names);
    };
    Project.prototype.UpdateLayout = function (Mode) {
        // обновляем радиус ноды
        this.SetRadiusFromMode(Mode);
        // обновляем радиусы элементов
        this.statusRing.SetRadius(this.currentPosition.r * 0.8, this.currentPosition.r * 0.84);
        this.svgShares.SetRadius(this.currentPosition.r * 0.8);
        this.textLabel.SetRadius(this.currentPosition.r * 0.8);
        this.health1.SetRadius(this.currentPosition.r * 0.9, this.currentPosition.r * 1.0);
        if (this.star == true) {
            this.starInstance.Draw(this.currentPosition.r);
        }
        else {
            this.starInstance.Remove();
        }
    };
    // Update position according to Layout
    Project.prototype.UpdatePosition = function (cx, cy) {
        this.currentPosition.cx = cx;
        this.currentPosition.cy = cy;
    };
    Project.prototype.RenderPosition = function () {
        this.svgElement.transition().attr("transform", "translate(" + (this.currentPosition.cx) + "," + (this.currentPosition.cy) + ")");
    };
    return Project;
})();
module.exports = Project;

},{"./Render":11,"./Sys":13}],9:[function(require,module,exports){
var Project = require('./Project');
var Projects = (function () {
    function Projects(parentSvgElement, data) {
        this.nodes = [];
        this.parentSvgElement = parentSvgElement;
        for (var i = 0; i < data.length; i++) {
            var newProject = new Project(parentSvgElement, data[i]);
            this.nodes.push(newProject);
        }
    }
    Projects.prototype.FindByName = function (name) {
        for (var i = 0; i < this.nodes.length; i++) {
            var node_index = -1;
            if (this.nodes[i].name === name)
                node_index = i;
            if (node_index !== -1)
                return this.nodes[i];
        }
    };
    Projects.prototype.FindIndexByName = function (name) {
        for (var i = 0; i < this.nodes.length; i++) {
            var node_index = -1;
            if (this.nodes[i].name === name)
                node_index = i;
            if (node_index !== -1)
                return i;
        }
    };
    Projects.prototype.FindChildrensNames = function (name) {
        var output = new Array;
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].parent === name)
                output.push(this.nodes[i].name);
        }
        return output;
    };
    Projects.prototype.FindChildrensIndexes = function (name) {
        var output = new Array;
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].parent === name)
                output.push(i);
        }
        return output;
    };
    Projects.prototype.FindWithChildrensByName = function (name) {
    };
    Projects.prototype.FindWithParentsByName = function (name) {
        var output = [];
        var currentProject = this.FindByName(name);
        do {
            output.push(currentProject);
            currentProject = this.FindByName(currentProject.parent);
        } while (currentProject != undefined);
        return output;
    };
    Projects.prototype.Filter = function (types, statuses) {
        var output = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if ((types.indexOf(this.nodes[i].type) >= 0) && (statuses.indexOf(this.nodes[i].status) >= 0)) {
                output.push(this.nodes[i]);
            }
        }
        //console.log(output);
        return output;
    };
    return Projects;
})();
module.exports = Projects;

},{"./Project":8}],10:[function(require,module,exports){
var Sys = require('./Sys');
var Layout = require('./Layout');
var View = require('./View');
//import Link = require('./Link');
var LinkArray = require('./LinkArray');
var Breadcrumbs = require('./Breadcrumbs');
var UpdateLegend = require('./Legend');
var ProjectManager = (function () {
    function ProjectManager(projects, svg) {
        this.layout = new Layout(projects);
        this.projects = projects;
        this.svg = projects.parentSvgElement;
        this.links = new LinkArray(this.layout, this.projects, svg.svg);
        this.view = new View(this.layout, svg);
        var view = this.view;
        // Update Nodes positions
        this.layout.UpdateMetaLayout(this.projects);
        // Rerender node to new coordinates
        var coordinates = this.layout.GetNodesPosition();
        for (var i = 0; i < this.projects.nodes.length; i++) {
            this.projects.nodes[i].UpdatePosition(coordinates[i][0], coordinates[i][1]);
        }
        this.links.Update();
        for (var i = 0; i < this.projects.nodes.length; i++) {
            this.projects.nodes[i].Render();
        }
        $("g.project").tooltip({
            'container': 'body',
            'placement': 'right'
        });
        var context = this;
        var GoTo = this.GoToName;
        this.projects.nodes.forEach(function (node) {
            node.svgElement.on("dblclick", function (d) {
                GoTo.call(context, node.name);
            });
        });
        this.view.SetView(0, false);
        console.log(GoTo);
        this.breadcrumbs = new Breadcrumbs(".paths", GoTo);
    }
    ProjectManager.prototype.GetAllNames = function () {
        var output = [];
        this.projects.nodes.forEach(function (node) {
            output.push(node.name);
        });
        return output;
    };
    ProjectManager.prototype.GoToName = function (name, infoMode) {
        this.currentName = name;
        // Find index
        var index = this.projects.FindIndexByName(name);
        // Go to index
        this.view.SetView(index, infoMode);
        var names = [];
        this.projects.FindWithParentsByName(name).forEach(function (item) {
            names.push(item.name);
        });
        names = names.reverse();
        this.breadcrumbs.UpdatePath(names);
        var GoTo = this.GoToName;
        var context = this;
        $(".pathc").each(function () {
            $(this).on("click", function () {
                var projectName = $(this).children("a").text();
                GoTo.call(context, projectName);
                console.log(projectName);
            });
        });
    };
    ProjectManager.prototype.GoToParent = function () {
        var nodeIndex = this.projects.FindIndexByName(this.currentName);
        var node = this.projects.nodes[nodeIndex];
        var parentName = node.parent;
        if (parentName !== "NA" && parentName !== undefined) {
            this.currentName = parentName;
            this.GoToName(parentName, false);
        }
    };
    ProjectManager.prototype.ChangeState = function (types, statuses, text, sharesMode, displayStar) {
        UpdateLegend(Sys.GetLegend(sharesMode));
        var projects = this.projects;
        var currentSelection = projects.Filter(types, statuses);
        projects.nodes.forEach(function (entry) {
            entry.Hide();
        });
        currentSelection.forEach(function (entry) {
            //console.log(entry);
            var entryWithParents = projects.FindWithParentsByName(entry.name);
            entryWithParents.forEach(function (node) {
                node.Show();
                node.SetMode(text, sharesMode, displayStar);
            });
        });
    };
    ProjectManager.prototype.UpdateLayout = function (Mode) {
        // Update Radiuses of projects
        this.projects.nodes.forEach(function (entry) {
            entry.UpdateLayout(Mode);
        });
        // Update Nodes positions
        this.layout.UpdateMetaLayout(this.projects);
        this.view.SetView(0, false);
        // Rerender node to new coordinates
        var coordinates = this.layout.GetNodesPosition();
        for (var i = 0; i < this.projects.nodes.length; i++) {
            this.projects.nodes[i].UpdatePosition(coordinates[i][0], coordinates[i][1]);
        }
        this.links.Update();
        for (var i = 0; i < this.projects.nodes.length; i++) {
            this.projects.nodes[i].RenderPosition();
        }
    };
    return ProjectManager;
})();
module.exports = ProjectManager;

},{"./Breadcrumbs":2,"./Layout":3,"./Legend":4,"./LinkArray":6,"./Sys":13,"./View":14}],11:[function(require,module,exports){
// Сюда скидываем функции, которые отвечают за перерисовку графических элементов проекта
// Классы предоставляют только интерфейс и данных о проектах не хранят!
var Sys = require('./Sys');
var Star = (function () {
    function Star(parentSvgElement) {
        this.parentSvgElement = parentSvgElement.append("g").attr("class", "star");
    }
    Star.prototype.SetDisplayMode = function (mode) {
        this.displayMode = mode;
        if (mode = false) {
            this.Remove();
        }
    };
    Star.prototype.Draw = function (Radius) {
        console.log("I`m drawing a start");
        this.Remove();
        if (this.displayMode == true) {
            var scale = 1.5 * Radius;
            this.svgElement = this.parentSvgElement.append("image").attr("xlink:href", "img/star.svg").attr("width", 2 * scale).attr("height", 2 * scale).attr("transform", "translate(" + (-scale) + "," + (-scale) + ")");
        }
    };
    Star.prototype.Remove = function () {
        if (this.svgElement !== undefined) {
            this.svgElement = this.svgElement.remove();
        }
    };
    return Star;
})();
exports.Star = Star;
var Link = (function () {
    function Link(parentSvgElement, type) {
        this.parentSvgElement = parentSvgElement.append("g").attr("class", "line " + type);
    }
    Link.prototype.Draw = function (fromV, toV) {
        this.svgElement = this.parentSvgElement.append("line").attr("x1", fromV[0]).attr("y1", fromV[1]).attr("x2", toV[0]).attr("y2", toV[1]).attr("vector-effect", "non-scaling-stroke");
    };
    Link.prototype.Remove = function () {
        if (this.svgElement !== undefined) {
            this.svgElement = this.svgElement.remove();
        }
    };
    return Link;
})();
exports.Link = Link;
var Health = (function () {
    function Health(parentSvgElement, innerR, outerR, value) {
        var health;
        if (value < 0.25) {
            health = "problem";
        }
        else if (value < 0.5) {
            health = "ok";
        }
        else if (value < 1) {
            health = "good";
        }
        this.value = value;
        this.svgElement = parentSvgElement.append("g").attr("class", "healthArc " + health).append("g").append("path").attr("d", Sys.healthRingGenerator(innerR, outerR, value));
    }
    Health.prototype.SetRadius = function (innerR, outerR) {
        this.svgElement.transition().duration(750).attr("d", Sys.healthRingGenerator(innerR, outerR, this.value));
    };
    Health.prototype.Remove = function () {
        this.svgElement = this.svgElement.remove();
    };
    return Health;
})();
exports.Health = Health;
var ProjectStatusRing = (function () {
    function ProjectStatusRing(parentSvgElement, innerR, outerR, cssClass) {
        this.svgElement = parentSvgElement.append("g").attr("class", "statusRing").append("g").attr("class", "status " + Sys.excludeSpaces(cssClass)).append("path").attr("d", Sys.ringGenerator(innerR, outerR));
    }
    ProjectStatusRing.prototype.SetRadius = function (innerR, outerR) {
        this.svgElement.transition().attr("d", Sys.ringGenerator(innerR, outerR));
    };
    ProjectStatusRing.prototype.Remove = function () {
        this.svgElement = this.svgElement.remove();
    };
    return ProjectStatusRing;
})();
exports.ProjectStatusRing = ProjectStatusRing;
var ProjectLabel = (function () {
    function ProjectLabel(parentSvgElement, r, data) {
        this.xDim = 1.5 * r;
        this.yDim = 1.5 * r;
        this.foreignObject = parentSvgElement.append("g").append('foreignObject');
        this.outerDiv = this.foreignObject.append("xhtml:div");
        this.innerDiv = this.outerDiv.style("text-align", "center").style("font-family", "Ubuntu").style("display", "flex").style("align-items", "center").style("justify-content", "center").append("xhtml:div");
        this.text = [data.name];
        this.SetRadius(r);
    }
    ProjectLabel.prototype.SetRadius = function (r) {
        this.xDim = 1.5 * r;
        this.yDim = 1.5 * r;
        this.foreignObject.transition().attr('x', -0.5 * this.xDim).attr('y', -0.5 * this.yDim).attr('width', this.xDim).attr('height', this.yDim);
        this.outerDiv.transition().style("height", this.xDim + "px");
        this.SetText(this.text);
    };
    ProjectLabel.prototype.Remove = function () {
        this.foreignObject = this.foreignObject.remove();
    };
    ProjectLabel.prototype.SetText = function (text) {
        console.log(text);
        var xDim = this.xDim;
        var svgElement = this.innerDiv;
        svgElement.selectAll("p").remove();
        text.forEach(function (sentence) {
            svgElement.append("p").style("margin", "0px").attr("class", "text name").style("font-size", Sys.getFontSize(xDim, 6, sentence) + "px").html(sentence);
        });
    };
    return ProjectLabel;
})();
exports.ProjectLabel = ProjectLabel;
var ProjectPieChart = (function () {
    function ProjectPieChart(parentSvgElement, shares, names, r) {
        this.r = r;
        this.shares = shares;
        this.names = names;
        this.svgElement = parentSvgElement.append("g").attr("class", "shares");
        this.svgElement.selectAll(".arc").data(Sys.pieGenerator()(shares)).enter().append("g").attr("class", function (d, i) {
            return names[i];
        }).append("path").attr("d", Sys.arcGenerator(r));
    }
    ProjectPieChart.prototype.Remove = function () {
        this.svgElement = this.svgElement.remove();
    };
    ProjectPieChart.prototype.SetProperty = function (shares, names) {
        this.shares = shares;
        this.names = names;
        var svgElement = this.svgElement;
        //console.log(svgElement);
        //console.log("Hooray!!!\n", shares, names);
        svgElement.selectAll("g").remove();
        svgElement.selectAll(".arc").data(Sys.pieGenerator()(shares)).enter().append("g").attr("class", function (d, i) {
            return names[i];
        }).append("path").attr("d", Sys.arcGenerator(this.r));
    };
    ProjectPieChart.prototype.SetRadius = function (r) {
        this.r = r;
        var svgElement = this.svgElement;
        var names = this.names;
        svgElement.selectAll("path").transition().attr("d", Sys.arcGenerator(r));
    };
    return ProjectPieChart;
})();
exports.ProjectPieChart = ProjectPieChart;

},{"./Sys":13}],12:[function(require,module,exports){
var SVG_graph = (function () {
    function SVG_graph(width, height, parentTag) {
        this.zoom = d3.behavior.zoom().scaleExtent([0.0001, 20000]);
        this.preSvg = d3.select(parentTag).append("div").classed("svg-yNamecontainer", true).append("svg").call(this.zoom.on("zoom", this.zoomFunction.bind(this))).on("dblclick.zoom", null).attr("preserveAspectRatio", "xMaxYMin slice").attr("viewBox", "0 0 " + width + " " + height).classed("svg-content-responsive", true).append("g").attr("id", "scale-g");
        this.svg = this.preSvg;
    }
    SVG_graph.prototype.zoomFunction = function () {
        this.preSvg.attr("transform", "translate(" + d3.event.translate + "),scale(" + d3.event.scale + ")");
    };
    return SVG_graph;
})();
module.exports = SVG_graph;

},{}],13:[function(require,module,exports){
///<reference path="./../definitions/d3.d.ts" />
// Сюда мы пишем просто вспомогательные функции, которые нам не нужны в других местах
function maxWordLength(string) {
    var maxLength = 0;
    var lateIndex = 0;
    for (var i = 0; i < string.length; i++) {
        if (string[i] === " " || (i === (string.length - 1))) {
            if ((i - lateIndex) > maxLength)
                maxLength = i - lateIndex;
            lateIndex = i;
        }
    }
    return maxLength;
}
function getFontSize(stringLength, maxStringNumber, text) {
    var longestWord = maxWordLength(text);
    var textLength = text.length;
    return Math.round(Math.min(((stringLength * maxStringNumber) / textLength), (stringLength / longestWord)));
}
exports.getFontSize = getFontSize;
function excludeSpaces(string) {
    var output = "";
    for (var i = 0; i < string.length; i++) {
        if (string[i] != " " && string[i] != "&")
            output += string[i];
    }
    return output;
}
exports.excludeSpaces = excludeSpaces;
function healthRingGenerator(innerR, outerR, value) {
    return d3.svg.arc().outerRadius(outerR).innerRadius(innerR).cornerRadius((outerR - innerR) / 2).startAngle(0).endAngle(value * 2 * Math.PI);
}
exports.healthRingGenerator = healthRingGenerator;
function ringGenerator(innerR, outerR) {
    return d3.svg.arc().outerRadius(outerR).innerRadius(innerR).startAngle(0).endAngle(2 * Math.PI);
}
exports.ringGenerator = ringGenerator;
function arcGenerator(outerR) {
    return d3.svg.arc().outerRadius(outerR).innerRadius(0);
}
exports.arcGenerator = arcGenerator;
function pieGenerator() {
    return d3.layout.pie().sort(null).value(function (d) {
        return d;
    });
}
exports.pieGenerator = pieGenerator;
exports.SHARES_NAMES = {
    share: ["UCTT share", "TK share", "partner share", "partner share", "partner share", "partner share", "partner share"],
    money: ["UCTT money", "TK money", "MULT money"],
    capexopex: ["CAPEX capexopex", "OPEX capexopex"]
};
function GetLegend(mode) {
    if (mode == "Доли") {
        return exports.SHARES;
    }
    ;
    if (mode == "Деньги") {
        return exports.MONEY;
    }
    ;
    if (mode == "CapexOpex") {
        return exports.СAPEXOPEX;
    }
    ;
    if (mode == "ТипыПроектов") {
        return exports.TYPES;
    }
    ;
}
exports.GetLegend = GetLegend;
;
exports.STATUSES = [
    ["Все в порядке", "status Всеок"],
    ["Есть проблемы", "status Естьпроблемы"],
    ["Требует Вмешательства", "status Требуетвмешательства"],
    ["В проработке", "status Впроработке"],
    ["На полке", "status Полка"]
];
exports.MONEY = [
    ["Деньги УЦТТ", "money UCTT"],
    ["Деньги рычаг", "money TK"],
    ["Деньги партеров", "money partner"]
];
exports.SHARES = [
    ["Доля УЦТТ", "share UCTT"],
    ["Доля ТК", "share TK"],
    ["Доля партеров", "share partner"]
];
exports.СAPEXOPEX = [
    ["Capex", "capexopex CAPEX"],
    ["Opex", "capexopex OPEX"]
];
exports.TYPES = [
    ["ТК", "type ТК"],
    ["Стартап", "type Стартап"],
    ["Инкубатор", "type Инкубатор "],
    ["Сервисная компания", "type Сервиснаякомпания"],
    ["Внутренний r&d", "type Внутреннийrd"],
    ["ЗОКР", "type ЗОКР"],
    ["Интеллектуальная собственность", "type Интеллектуальнаясобственность"]
];

},{}],14:[function(require,module,exports){
///<reference path="./../definitions/d3.d.ts" />
var View = (function () {
    function View(layout, svg) {
        this.svg = svg.svg;
        this.preSvg = svg.preSvg;
        this.zoom = svg.zoom;
        this.layout = layout;
        this.lastP = [0, 0, 7500];
    }
    View.prototype.transition = function (svg, zoom, start, end) {
        var center = [7500, 4000];
        var i = d3.interpolateZoom(start, end);
        d3.transition().duration(i.duration).tween("zoom", function () {
            return function (t) {
                var p = transform(i(t));
                svg.call(zoom.event);
                zoom.scale(p[0]).translate([p[1], p[2]]);
            };
        });
        function transform(p) {
            var k = 4000 / p[2];
            return [k, (center[0] - p[0] * k), (center[1] - p[1] * k)];
        }
    };
    View.prototype.SetView = function (rootIndex, infoMode) {
        var centerX = 7500;
        var centerY = 4000;
        if (rootIndex == -1) {
            rootIndex = this.lastIndex;
        }
        else {
            this.lastIndex = rootIndex;
            if (this.layout.metaLayout[rootIndex].childrens.length == 0) {
                // if view individual disable tooltip
                $("g.project").tooltip('disable');
            }
            else {
                // if view is groupped enable tooltip
                $("g.project").tooltip('enable');
            }
        }
        console.log(this.zoom.scale());
        console.log(this.zoom.translate());
        var scaleZoom = this.zoom.scale();
        var translateZoom = this.zoom.translate();
        var lastP = [
            (centerX - (translateZoom[0])) / scaleZoom,
            (centerY - (translateZoom[1])) / scaleZoom,
            centerY / scaleZoom
        ];
        console.log(lastP);
        var scale = centerY / (this.layout.metaLayout[rootIndex].Rout + this.layout.metaLayout[rootIndex].RchMax);
        var translate = [
            centerX - this.layout.metaLayout[rootIndex].cx * scale,
            centerY - this.layout.metaLayout[rootIndex].cy * scale
        ];
        var height = (this.layout.metaLayout[rootIndex].Rout + this.layout.metaLayout[rootIndex].RchMax);
        var plusX = 0;
        if (infoMode == true) {
            plusX = -3000;
        }
        var newP = [this.layout.metaLayout[rootIndex].cx + plusX / scale, this.layout.metaLayout[rootIndex].cy, height];
        this.transition(this.svg, this.zoom, lastP, newP);
    };
    return View;
})();
module.exports = View;

},{}]},{},[1]);
