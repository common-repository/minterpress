"use strict";(self.webpackChunkminterpress=self.webpackChunkminterpress||[]).push([[758],{8758:(t,e,s)=>{s.r(e),s.d(e,{default:()=>i});class i{constructor(t){this.el=t,this.init()}setVars(){this.toggle=this.el.querySelector('[data-toggle-container="toggle"]'),this.container=this.el.querySelector('[data-toggle-container="container"]');const t=this.el.dataset.toggleContainerClasses;this.classesArray=t.split(" ")}toggleContainer(){this.classesArray.forEach((t=>{this.container.classList.toggle(t)}))}bindEvents(){this.toggle.addEventListener("click",(()=>this.toggleContainer()))}init(){this.setVars(),this.bindEvents()}}}}]);