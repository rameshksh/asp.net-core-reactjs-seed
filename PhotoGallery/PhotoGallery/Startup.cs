using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using PhotoGallery.Infrastructure;
using PhotoGallery.Infrastructure.Mappings;
using PhotoGallery.Infrastructure.Repositories;
using PhotoGallery.Infrastructure.Services;

namespace PhotoGallery
{
    public class Startup
    {
        private static string _applicationPath = string.Empty;
        private static string _contentRootPath = string.Empty;

        public Startup(IConfiguration configuration, IHostingEnvironment env)
        {
            Configuration = configuration;

            _applicationPath = env.WebRootPath;
            _contentRootPath = env.ContentRootPath;
            // Setup configuration sources.

            var builder = new ConfigurationBuilder()
                .SetBasePath(_contentRootPath)
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string sqlConnectionString = Configuration["ConnectionStrings:DefaultConnection"];
            bool useInMemoryProvider = bool.Parse(Configuration["Data:PhotoGalleryConnection:InMemoryProvider"]);

            services.AddDbContext<PhotoGalleryContext>(options =>
            {
                switch (useInMemoryProvider)
                {
                    case true:
                        options.UseInMemoryDatabase();
                        break;
                    default:
                        options.UseSqlServer(sqlConnectionString);
                        break;
                }
            });

            // Repositories
            services.AddScoped<IPhotoRepository, PhotoRepository>();
            services.AddScoped<IAlbumRepository, AlbumRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserRoleRepository, UserRoleRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<ILoggingRepository, LoggingRepository>();

            // Services
            services.AddScoped<IMembershipService, MembershipService>();
            services.AddScoped<IEncryptionService, EncryptionService>();

            services.AddAuthentication();

            // Polices
            services.AddAuthorization(options =>
            {
                // inline policies
                options.AddPolicy("AdminOnly", policy =>
                {
                    policy.RequireClaim(ClaimTypes.Role, "Admin");
                });

            });

            // Add MVC services to the services container.
            services.AddMvc()
            .AddJsonOptions(opt =>
            {
                var resolver = opt.SerializerSettings.ContractResolver;
                if (resolver != null)
                {
                    var res = resolver as DefaultContractResolver;
                    res.NamingStrategy = null;
                }
            });

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();



            // this will serve up wwwroot
            app.UseStaticFiles();

            AutoMapperConfiguration.Configure();

            app.UseAuthentication();

            // Custom authentication middleware
            //app.UseMiddleware<AuthMiddleware>();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });

            DbInitializer.Initialize(app.ApplicationServices, _applicationPath);
        }
    }
}
