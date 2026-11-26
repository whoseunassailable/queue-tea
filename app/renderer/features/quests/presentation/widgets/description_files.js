"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFileLink = exports.DescriptionFiles = void 0;
var description_files_1 = require("../../../../../../hooks/shared/records/domain/services/description_files");
var note_attachment_1 = require("../../../../core/widgets/note_attachment");
// A preview for each file the description links, gone once its link is.
var DescriptionFiles = function (_a) {
    var engine = _a.engine, realm = _a.realm, text = _a.text;
    var files = (0, description_files_1.descriptionFiles)(text);
    if (files.length === 0)
        return null;
    return (<div class="d-files">
      {files.map(function (file, index) { return (<note_attachment_1.NoteAttachment key={"".concat(index, ":").concat(file.path)} engine={engine} realm={realm} path={file.path} name={file.name} embedded={file.isImage}/>); })}
    </div>);
};
exports.DescriptionFiles = DescriptionFiles;
// A link on a line of its own at the end, for a box with no caret to use.
var withFileLink = function (text, markdown) { return "".concat(text).concat(text === '' || text.endsWith('\n') ? '' : '\n').concat(markdown, "\n"); };
exports.withFileLink = withFileLink;
