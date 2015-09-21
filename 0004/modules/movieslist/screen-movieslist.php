<style scoped>
    button{cursor:pointer !important}
    #panel-L [role=input]{width:100%;height:30px;border:none;outline:none;background-color:#eee}
    .jqx-dropdownlist-state-normal{border:none;background-color:#eee;color:#000}
    .jqx-listbox{border:none;color:#000;background-color:#CEE3F6;}
    .jqx-input{border:none;color:#000;background-color:#eee;cursor:pointer}
    .jqx-input input {border:none;color:#000;background-color:#eee;cursor:pointer}
</style>
<div id="panel-L" style="float:left;margin-left:12px;">
    <div>REQUIREMENTS</div>
    <div>
        <ul>
            <li style="display:none"><input id="txt-id" hidden="true" value=""></li>
            <li style="text-align:center;margin-top:19px;margin-bottom:19px;"><button id="btn-new">NEW</button></li>
            <li>Short Title</li>
            <li><input id="txt-shorttitle" role="input" style="font-weight:bold"></li>
            <li>International Title</li>
            <li><input id="txt-inttitle" role="input"></li>
            <li>Title</li>
            <li><input id="txt-title" role="input"></li>
            <li>Runtime | Format</li>
            <li><input id="txt-runtime" role="input" style="width:35%" maxlength="3"><div id="lst-format" role="input" style="width:60%;float:right"></div></li>
            <li>Release Date</li>
            <li><div id="txt-releasedate" role="input" style="float:right"></div></li>
            <li>Genres</li>
            <li><div id="lst-genres" role="input" style="float:right"></div></li>
            <li>Restricted</li>
            <li><div id="lst-restricted" role="input" style="float:right"></div></li>
            <li style="text-align:center;"><button id="btn-r-save" style="margin-top:20px;">SAVE</button></li>
        </ul>
    </div>
    <div>ADDITIONS</div>
    <div>
        <ul>
            <li>Studio</li>
            <li><div id="lst-studios" role="input" style="float:right"></div></li>
            <li>Distributor</li>
            <li><div id="lst-distributors" role="input" style="float:right"></div></li>
            <li>Storyline</li>
            <li><div id="txt-storyline" role="input" style="height:200px;float:right;overflow-y:auto" contenteditable="true"></div></li>
            <li style="text-align:center;"><button id="btn-a-save" style="margin-top:20px">SAVE</button></li>
        </ul>
    </div>
</div>
<div style="float:left;margin-left:12px;">
    <div id="grid-movieslist" style="float:left;cursor:pointer"></div>
    <div style="float:left;margin-left:12px;width:136px;">
        <div id="img-thumbnail" style="height:195px;background-color:#eee;background-image:url(img/empty.jpg);background-size:100% auto;cursor:pointer"></div>
        <button id="btn-mark" value="0" style="margin-top:12px;cursor:pointer;">MARK</button><br>
        <button id="btn-popular" value="0" style="margin-top:12px;cursor:pointer;">POPULAR</button><br>
        <button id="btn-disabled" value="0" style="margin-top:12px;cursor:pointer;">DISABLED</button>
    </div>
</div>
<input type="file" id="file-upload" accept="image/*" hidden>
<script src="modules/movieslist/movieslist.js"></script>