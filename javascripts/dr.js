var slides = [
    'title',
    'sub_title',
    'topic_concepts',
    'content_concepts_1',
    'content_concepts_2',
    'topic_ipm_workflow',
    'content_workflow_major_branches',
    'content_workflow_updating',
    'content_workflow_new_sprint',
    'content_workflow_committing',
    'content_workflow_fixing_defect',
    'topic_github_workflow',
    'content_github_fork',
    'content_github_pull_request',
    'topic_cmds',
    'content_cmds_apply_1',
    'content_cmds_apply_2',
    'content_cmds_apply_3',
    'content_cmds_undo_1',
    'content_cmds_undo_2',
    'content_cmds_refs_1',
    'content_cmds_refs_2',
    'content_cmds_branching_1',
    'content_cmds_branching_2',
    'content_cmds_branching_3',
    'content_cmds_branching_4',
    'content_cmds_branching_5',
    'content_cmds_committing_1',
    'content_cmds_committing_2',
    'content_cmds_committing_3',
    'content_cmds_committing_4',
    'content_cmds_committing_5',
    'content_cmds_committing_6',
    'content_cmds_logging',
    'topic_references',
    'content_ref_tools',
    'content_ref_tutorials',
    'content_ref_tips',
    'fin'
];

$(function() {
    new Spinner({length:50, radius: 30, width: 15}).spin(document.getElementById('spinner'));

    loadSlide(0);
});

function loadSlide(index) {
    var slideName = slides[index];
    $.ajax({
        type: 'GET',
        url: 'views/' + slideName + '.html',
        dataType: 'text',
        success: function(content) {
            afterSlideLoaded(slideName, content, index);
        }
    });
}

function afterSlideLoaded(slideName, content, index) {
    $('<section/>').attr('id', slideName).addClass('slide').hide().html(content).appendTo(".deck-container");
    if (index < slides.length - 1) {
        loadSlide(index + 1);
    } else {
        prepareScreen();
        $('#spinner').remove();
    }
}

var positionTypes = [
    {name: 'halign', positioning: function(obj, ref, offset) { obj.css('left', ref.left + 'px') } },
    {name: 'valign', positioning: function(obj, ref, offset) { obj.css('top', ref.top + 'px') } },
    {name: 'above',  positioning: function(obj, ref, offset) { obj.css('top', (ref.top - obj.height() - offset) + 'px') } },
    {name: 'below',  positioning: function(obj, ref, offset) { obj.css('top', (ref.bottom + offset) + 'px') } },
    {name: 'ahead',  positioning: function(obj, ref, offset) { obj.css('left', (ref.left - obj.width() - offset) + 'px') } },
    {name: 'after',  positioning: function(obj, ref, offset) { obj.css('left', (ref.right + offset) + 'px') } }
];

function prepareScreen() {
    $('section.slide').show();

    prepareDeck();

    $(window).bind("resize", positioning);
}

function prepareDeck() {
    $.deck('.slide');    

    $('p.deck-status').bind('click', toggleGoTo);

    $(document).bind("deck.changed", function(event, current) {
        positioning('section.slide:eq(' + current + ')');
    });
    positioning();
}

function toggleGoTo() {
    if ($('.goto-form').css('display') === 'none') {
        $.deck('showGoTo');
    } else {
        $.deck('hideGoTo');
    }
}

function positioning(modifier) {
    var x = $(window).width() / 2;
    var y = $(window).height() / 2;

    if (typeof modifier !== 'string') {
        modifier = "";
    }

    $(modifier + " .hcenter").each(function() {
        $(this).css('left', (x - $(this).width() / 2) + 'px');
    });

    for (var i = 0; i < positionTypes.length; i++) {
        positioningForType(modifier, positionTypes[i]);
    }
}

function positioningForType(modifier, type) {
    $(modifier + ' .' + type.name + '-to').each(function() {
        var obj = $(this);        
        var ref = getRef(obj, type.name + '-ref', findWithinSameSection);
        if (ref) {
            type.positioning(obj, decoratesWithPosition(ref), getOffset(obj, type));
        }
    });
}

function getOffset(obj, type) {
    var attr = type.name + '-offset';
    return obj.attr(attr) ? parseInt(obj.attr(attr)) : obj.attr('data-offset') ? parseInt(obj.attr('data-offset')) : 10;
}

function getRef(obj, attrRef, refFinder) {
    var ref;
    if (typeof refFinder === 'function') {
        ref = refFinder(obj, obj.attr(attrRef));
    } else {
        ref = obj.find(obj.attr(attrRef));
    }
    if (!ref) return false;
    return ref;
}

function findWithinSameParent(obj, refName) {
    return obj.parent().find(refName);
}

function findWithinSameSection(obj, refName) {
    return obj.closest("section").find(refName);
}

function decoratesWithPosition(ref) {
    if (isNull(ref)) return ref;
    var pos = ref.position();
    if (isNull(pos)) return ref;
    return {'left':   pos.left,
            'top':    pos.top,
            'right':  pos.left + ref.width(),
            'bottom': pos.top + ref.height(),
            'height': ref.height(),
            'width':  ref.width()};
}

function isNull(ref) {
    return !ref || (typeof ref == 'undefined');
}