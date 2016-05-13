
var UIFilters = React.createClass({
  ajaxRegions:function(){
    this.state.regions = [
      {
        'region_code':'110000',
        'name':'北京',
        'children':[
          {
            'region_code':'110000',
            'name':'北京'
          }
        ]
      },
      {
        'region_code':'310000',
        'name':'上海',
        'children':[
          {
            'region_code':'310000',
            'name':'上海'
          }
        ]
      },
      {
        'region_code':'440000',
        'name':'广东',
        'children':[
          {
            'region_code':'440000',
            'name':'省本级',
          },
          {
            'region_code':'440600',
            'name':'佛山'
          }
        ]
      },
      {
        'region_code':'330000',
        'name':'浙江',
        'children':[
          {
            'region_code':'330000',
            'name':'省本级'
          },
          {
            'region_code':'330100',
            'name':'杭州'
          },
          {
            'region_code':'330300',
            'name':'温州'
          }
        ]
      },
      {
        'region_code':'320000',
        'name':'江苏',
        'children':[
          {
            'region_code':'320000',
            'name':'省本级'
          },
          {
            'region_code':'320100',
            'name':'南京'
          },
          {
            'region_code':'320500',
            'name':'苏州'
          }
        ]
      },
      {
        'region_code':'350000',
        'name':'福建',
        'children':[
          {
            'region_code':'350000',
            'name':'省本级'
          }
        ]
      },
      {
        'region_code':'370000',
        'name':'山东',
        'children':[
          {
            'region_code':'370000',
            'name':'省本级'
          }
        ]
      },
      {
        'region_code':'510000',
        'name':'四川',
        'children':[
          {
            'region_code':'510000',
            'name':'省本级'
          }
        ]
      },
      {
        'region_code':'410000',
        'name':'河南',
        'children':[
          {
            'region_code':'410000',
            'name':'省本级'
          }
        ]
      }


    ];
  },
  getInitialState: function() {
    return {
      regions:[],
      provinces:[],
      cities:[]
    };
  },
  componentWillMount: function() {
    console.log('filterbar willMount!');
  },
  componentDidMount: function() {
    console.log('filterbar didMount!');
    this.ajaxRegions();
    this.setState({
      provinces:this.state.regions,
      cities:this.state.regions[0].children,
    });
  },
  handleProvinceChange:function(e){
    // var province_code = this.refs.filterProvince.value;
    var province_code = e.target.value;
    var province_name = '';
    var cities = this.state.regions.filter(function(item,i){
        if(item.region_code == province_code){
          province_name = item.name;
          return true;
        };
    })[0].children;
    this.setState({cities:cities});
    this.handleChangeByProvince();

    // map
    // var map = $('path.province div');
    // map.each(function(){
    //   var str = $(this).text();
    //   if(str.indexOf(province_name)>=0){
    //     $(this).parent().css({
    //       "fill":"red",
    //       "stroke":'red'
    //     });
    //   }else{
    //     $(this).parent().css({
    //       "fill":"#fff",
    //       "stroke":'#333'
    //     });
    //   }
    // });

    // react
    // console.log('设置state');
    // this.setState({cities:cities});
    // city的select内容修改，但是select的onchang事件未触发。
    // 手动触发，但是似乎未取到。
    // console.log('手动触发city change');
    // this.handleChange();

    // this.setState({cities:cities},this.handleChange());
  },

  handleChange:function(){
    console.log('changed~~~~');
    var data_type = this.refs.filterCategory.value;
    var city_code = this.refs.filterCity.value;
    this.props.onFilterChanged({
      region_code:city_code,
      data_type:data_type
    });
  },
  handleChangeByProvince:function(){
    var data_type = this.refs.filterCategory.value;
    var province_code = this.refs.filterProvince.value;
    this.props.onFilterChanged({
      region_code:province_code,
      data_type:data_type
    });
  },
  render: function() {
    console.log('filterbar render');
    var provinces = this.state.provinces;
    var cities = this.state.cities;
    return (
      <div className="row select-group">
        <h1>全国医保目录数据概览</h1>
        <div className="row">
          <div className="col-xs-4">
            <select onChange={this.handleProvinceChange} ref="filterProvince" className="ui dropdown selection  button" id="provinceSelect">
             {provinces.map(function(item,i){
               return (<option key={i} value={item.region_code}>{item.name}</option>);
             })}
            </select>
          </div>
          <div className="col-xs-4">
            <select onChange={this.handleChange} ref="filterCity" className="ui dropdown selection  button">
             {cities.map(function(item,i){
               return (<option key={i} value={item.region_code}>{item.name}</option>);
             })}
            </select>
          </div>
          <div className="col-xs-4">
            <select onChange={this.handleChange} ref="filterCategory" className="ui dropdown selection  button">
              <option value="1">药品目录</option>
              <option value="2">医疗服务项目目录</option>
              <option value="3">医疗服务设施目录</option>
            </select>
          </div>
        </div>
        <div className="emp15"></div>
      </div>  
    );
  }

});
var UISummary = React.createClass({
  render: function() {
    var region_name = this.props.data.region_name;
    var items = this.props.data.items || [];
    console.log('items',items);
    return (
      <div className="row" hidden={items.length>0 ? false:true}>
        <table className="ui definition table">
          <tbody>
            <tr>
              <td className="two wide column">地区</td>
              <td>{region_name}</td>
            </tr>
            {items.map( function(element, index) {
              if(element.data_type == 1){
                return (
                  <tr key={index}>
                    <td>药品</td>
                    <td>{element.total}条</td>
                  </tr>
                );
              }
              if(element.data_type == 2){
                return (
                  <tr key={index}>
                    <td>医疗服务项目</td>
                    <td>{element.total}条</td>
                  </tr>
                )
              }
              if(element.data_type == 3){
                return (
                  <tr key={index}>
                    <td>医疗服务设施</td>
                    <td>{element.total}条</td>
                  </tr>
                )
              }
            })}
          </tbody>
        </table>
      </div>
    );
  }

});
var UILists = React.createClass({
  showDetail:function(id){
    $('.ui.modal').modal('show');
    this.props.onShowDetail({id:id});
  },
  render: function() {
    var _this = this;
    var lists= this.props.data;
    var data_type = null;
    if(lists.length > 0){
      data_type = lists[0].data_type;
    }else{
      data_type = 0;
    }
    return (
      <div className="row">
        <table className="ui celled table" hidden={data_type !== 0 ? true : false }>
          <tbody>
           <tr>
             <td>未检索到相关数据</td>
           </tr>
          </tbody>
        </table>
        <table className="ui celled table" hidden={data_type !== 1 ? true : false }>
          <thead>
            <tr>
              <th>药品</th>
              <th>剂型</th>
              <th>类型</th>
              <th>自付比例</th>
              <th>其他</th>
            </tr>
          </thead>
          <tbody>
            {lists.map(function(item,i){
              return (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.jixing}</td>
                  <td>{item.category}</td>
                  <td>{item.payment}</td>
                  <td><div className="ui button default tiny" onClick={_this.showDetail.bind(_this,item.id)}>更多</div></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <table className="ui celled table" hidden={data_type !== 2 ? true : false }>
          <thead>
            <tr>
              <th>医疗服务项目</th>
              <th>类型</th>
              <th>自付比例</th>
            </tr>
          </thead>
          <tbody>
            {lists.map(function(item,i){
              return (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.payment}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <table className="ui celled table" hidden={data_type !== 3 ? true : false }>
          <thead>
            <tr>
              <th>医疗服务设施</th>
              <th>类型</th>
              <th>自付比例</th>
            </tr>
          </thead>
          <tbody>
            {lists.map(function(item,i){
              return (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.payment}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="emp5"></div>
      </div>
    );
  }
});

var UIModal = React.createClass({
  componentDidMount: function() {
  },
  show:function(){
    $('.ui.modal').modal('show');
  },
  hide:function(){
    $('.ui.modal').modal('hide');
  },
  render: function() {
    var item = this.props.data;
    var status = function(item){
      if(item.length<1){
        return 'loading';
      }else{
        return 'loaded';
      }
    };
    return (
      <div className="ui small modal">
        <i className="close icon"></i>
        <div className="header">
          数据详情
        </div>
        <div className="image content" style={{postion:'relative'}}>
            // <div className="ui active inverted dimmer" hidden={status == 'loading' ? true:false}>
            //   <div className="ui small text loader" >加载中...</div>
            // </div>
            <div className="" hidden={status == 'loaded' ? true:false}>
              这里是数据
            </div>
        </div>
        <div className="actions">
          <div className="ui button" onClick={this.hide}>Cancel</div>
          <div className="ui button" onClick={this.hide}>OK</div>
        </div>
      </div>
    );
  }

});


var UIView = React.createClass({
  ajaxLists:function(query){
    var url = '/api/mulu';
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      data: query,
      success: function(data) {
        this.setState({lists: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  ajaxList:function(query){
    var url = '/api/mulu';
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      data: query,
      success: function(data) {
        this.setState({list: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  ajaxSummary:function(query){
    var url = '/api/muluSummary';
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      data: query,
      success: function(data) {
        this.setState({summary: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  handleFilterChanged:function(data){
    console.log('data',data);
    var query = {};
    if(data){
      if(data.data_type){
        query.data_type = data.data_type;
      }else{
        query.data_type = 1;
      }
      if(data.region_code){
        query.region_code = data.region_code;
      }else{
        query.region_code = '110000';
      }
    }else{
      query ={
        data_type:1,
        region_code:'110000'
      }
    }
    this.ajaxLists(query);
    this.ajaxSummary(query);
  },
  handleShowDetail:function(query){
    this.ajaxList(query);
  },
  getInitialState: function() {
    return {
      lists: [],
      list: {},
      summary: {}
    };
  },
  componentDidMount: function() {
      this.ajaxLists();
  },
  render: function() {
    return (
      <div className="ui container">
        <UIFilters onFilterChanged={this.handleFilterChanged}/>
        <UISummary data={this.state.summary} />
        <UILists data={this.state.lists} onShowDetail={this.handleShowDetail}/>
        <UIModal data={this.state.list} />
      </div>
    );
  }
});
ReactDOM.render(
    <UIView />,
    document.getElementById('UIViewContainer')
);


