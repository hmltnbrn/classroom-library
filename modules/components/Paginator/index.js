import React from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

class Paginator extends React.Component {

    render() {
        let pages = Math.ceil(this.props.total/this.props.pageSize);
        let page = pages > 0 ? this.props.page + "/" + pages : "0/0";
        
        return (
            <div className="flex flex-column">
                <div className="flex">
                    <IconButton
                        disabled={this.props.page <= 1 ? true : false}
                        onClick={this.props.onPrevious}>
                        <ArrowBack/>
                    </IconButton>
                    <IconButton
                        disabled={this.props.page >= pages ? true : false}
                        onClick={this.props.onNext}>
                        <ArrowForward/>
                    </IconButton>
                </div>
                <div>
                    <span>{this.props.total} books • page {page}</span>
                </div>
            </div>
        );
    }
};

export default Paginator;
