import angular = require('angular');

var HTML_ESCAPES: {[key: string]: string} = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
};

var ESCAPE_HTML_CHAR_REGEXP = new RegExp('[&<>"\']', 'g');

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
var VOID_ELEMENTS = makeMap('area,br,col,hr,img,wbr');

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
var OPTIONAL_END_TAG_ELEMENTS = makeMap('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr,rp,rt');

// Safe Block Elements - HTML5
var BLOCK_ELEMENTS = makeMap('address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,section,table,ul');

// Inline Elements - HTML5
var INLINE_ELEMENTS = makeMap('a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var');

var VALID_ELEMENTS = angular.extend(
    {},
    VOID_ELEMENTS,
    OPTIONAL_END_TAG_ELEMENTS,
    BLOCK_ELEMENTS,
    INLINE_ELEMENTS
);

var URI_ATTRS = makeMap('background,cite,href,longdesc,src,usemap,xlink:href');

var HTML_ATTRS = makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,target,title,type,valign,value,vspace,width');

var VALID_ATTRS = angular.extend(
    {},
    URI_ATTRS,
    HTML_ATTRS
);

function makeMap(str: string): {[key: string]: boolean} {
    var obj: {[key: string]: boolean} = {},
        items = str.split(',');
    for (var i = 0, l = items.length; i < l; i++) obj[items[i]] = true;
    return obj;
}

function escapeHtmlChar(char: string): string {
    return HTML_ESCAPES[char];
}

function escapeHtml(str: string): string {
    return str.replace(ESCAPE_HTML_CHAR_REGEXP, escapeHtmlChar);
}

function isSafetyAttribute(attr: Attr): boolean {
    return attr.name.toLowerCase() in VALID_ATTRS;
}

function isSafetyNode(node: Node): boolean {
    return node.nodeName.toLowerCase() in VALID_ELEMENTS;
}

function isVoidElement(node: Node): boolean {
    return node.nodeName.toLowerCase() in VOID_ELEMENTS;
}

function nodeToOpenTag(node: Node): string {
    var attrs = node.attributes,
        attrHtmls: string[] = [];

    for (var i = 0, l = attrs.length; i < l; i++) {
        var attr = attrs[i];

        if (isSafetyAttribute(attr)) {
            var attrName = attr.name,
                attrValue = attr.value;

            if (attrValue == null) {
                attrHtmls.push(attrName);
            } else {
                attrHtmls.push(attrName + '="' + escapeHtml(attrValue) + '"');
            }
        }
    }

    return '<' + node.nodeName.toLowerCase() +
                 (attrHtmls.length ? ' ' + attrHtmls.join(' ') : '') + '>';
}

function nodeToCloseTag(node: Node): string {
    return '</' + node.nodeName.toLowerCase() + '>';
}

function htmlSanitizer(target: Node): string {
    var html = '',
        current = target,
        queue: Node[] = [];

    do {
        switch (current.nodeType) {
            case current.TEXT_NODE:
                html += current.textContent;
                break;

            case current.ELEMENT_NODE:
                if (isSafetyNode(current)) {
                    html += nodeToOpenTag(current);

                    var childNodes = current.childNodes;
                    if (childNodes.length) {
                        for (var i = childNodes.length - 1; i >= 0; --i) {
                            queue.push(childNodes[i]);
                        }
                    } else if (!isVoidElement(current)) {
                        html += nodeToCloseTag(current);
                    }
                }
                break;
        }

        while (!current.nextSibling && (current = current.parentNode)) {
            html += nodeToCloseTag(current);
        }
    } while (current = queue.pop());

    return html;
}

export = htmlSanitizer;
