var Header = React.createClass({
    render: function () {
        return (
            <header className="bar bar-nav">
                <a href="#" className={"icon icon-left-nav pull-left" + (this.props.back==="true"?"":" hidden")}></a>
                <h1 className="title">{this.props.text}</h1>
            </header>
        );
    }
});

var SearchBar = React.createClass({
    searchHandler: function() {
        this.props.searchHandler(this.refs.searchKey.getDOMNode().value);
    },
    render: function () {
        return (
            <div className="bar bar-standard bar-header-secondary">
                <input type="search" ref="searchKey" onChange={this.searchHandler} value={this.props.searchKey}/>
            </div>

        );
    }
});

var ContactListItem = React.createClass({
    render: function () {
        return (
            <li className="table-view-cell media">
                <a href={"#contacts/" + this.props.contact.Id}>
                    {this.props.contact.FirstName} {this.props.contact.LastName}
                    <p>{this.props.contact.Title}</p>
                </a>
            </li>
        );
    }
});

var ContactList = React.createClass({
    render: function () {
        var items = this.props.contacts.map(function (contact) {
            return (
                <ContactListItem key={contact.id} contact={contact} />
            );
        });
        return (
            <ul  className="table-view">
                {items}
            </ul>
        );
    }
});

var HomePage = React.createClass({
    render: function () {
        return (
            <div className={"page " + this.props.position}>
                <Header text="Salesforce Contacts" back="false"/>
                <SearchBar searchKey={this.props.searchKey} searchHandler={this.props.searchHandler}/>
                <div className="content">
                    <ContactList contacts={this.props.contacts}/>
                </div>
            </div>
        );
    }
});

var ContactPage = React.createClass({
    getInitialState: function() {
        return {contact: {}};
    },
    componentDidMount: function() {
        this.props.service.findById(this.props.contactId).done(function(result) {
            this.setState({contact: result});
        }.bind(this));
    },
    render: function () {
        return (
            <div className={"page " + this.props.position}>
                <Header text="Contact" back="true"/>
                <div className="card">
                    <ul className="table-view">
                        <li className="table-view-cell media">
                            <h1>{this.state.contact.FirstName} {this.state.contact.LastName}</h1>
                            <p>{this.state.contact.Title}</p>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"tel:" + this.state.contact.officePhone} className="push-right">
                                <span className="media-object pull-left icon icon-call"></span>
                                <div className="media-body">
                                Call Office
                                    <p>{this.state.contact.Phone}</p>
                                </div>
                            </a>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"tel:" + this.state.contact.mobilePhone} className="push-right">
                                <span className="media-object pull-left icon icon-call"></span>
                                <div className="media-body">
                                Call Mobile
                                    <p>{this.state.contact.MobilePhone}</p>
                                </div>
                            </a>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"sms:" + this.state.contact.mobilePhone} className="push-right">
                                <span className="media-object pull-left icon icon-sms"></span>
                                <div className="media-body">
                                SMS
                                    <p>{this.state.contact.MobilePhone}</p>
                                </div>
                            </a>
                        </li>
                        <li className="table-view-cell media">
                            <a href={"mailto:" + this.state.contact.email} className="push-right">
                                <span className="media-object pull-left icon icon-email"></span>
                                <div className="media-body">
                                Email
                                    <p>{this.state.contact.Email}</p>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
});

var App = React.createClass({
    mixins: [PageSlider],
    getInitialState: function() {
        return {
            searchKey: '',
            contacts: []
        }
    },
    searchHandler: function(searchKey) {
        contactService.findByName(searchKey).done(function(contacts) {
            this.setState({
                searchKey:searchKey,
                contacts: contacts,
                pages: [<HomePage key="list" searchHandler={this.searchHandler} searchKey={searchKey} contacts={contacts}/>]});
        }.bind(this));
    },
    componentDidMount: function() {
        router.addRoute('', function() {
            this.slidePage(<HomePage key="list" searchHandler={this.searchHandler} searchKey={this.state.searchKey} contacts={this.state.contacts}/>);
        }.bind(this));
        router.addRoute('contacts/:id', function(id) {
            this.slidePage(<ContactPage key="details" contactId={id} service={contactService}/>);
        }.bind(this));
        force.login(
            function() {
                console.log('Salesforce login succeeded');
                router.start();
            },
            function(error) {
                console.log(error);
                alert('Salesforce login failed');
            });
    }
});

React.render(<App/>, document.body);