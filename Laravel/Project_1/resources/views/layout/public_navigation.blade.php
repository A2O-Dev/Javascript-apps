<!-- Navigation -->
<nav id="mainNav" class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header page-scroll">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span> Menu <i class="fa fa-bars"></i>
            </button>
            <a class="navbar-brand logo" href="{{ '/' }}"><i class="rcicon-bullhorn"></i><span> ROLECALL</span></a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
                <li class="page-scroll">
                    <a href="{{ config('app.website_url') }}">Home</a>
                </li>
                @if(\Auth::check())
                    <li class="page-scroll">
                        <a href="{{ '/dashboard' }}">Dashboard</a>
                    </li>
                @else
                    <li class="page-scroll">
                        <a href="{{ '/login' }}">Log in</a>
                    </li>
                @endif
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
</nav>