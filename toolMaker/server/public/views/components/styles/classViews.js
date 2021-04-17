class ClassView {
  constructor(args) {
    this.host = args.host;
    this.view = $(`<div style="padding:3px; background-color:rgb(54,54,54); box-shadow: 0 0 2px black;"></div>`);
    this.host.append(this.view);
  }
}
