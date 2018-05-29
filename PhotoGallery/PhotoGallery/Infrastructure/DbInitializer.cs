﻿using PhotoGallery.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace PhotoGallery.Infrastructure
{
    public static class DbInitializer
    {
        private static PhotoGalleryContext _context;

        public static void Initialize(IServiceProvider serviceProvider, string imagesPath)
        {
            _context = (PhotoGalleryContext)serviceProvider.GetService(typeof(PhotoGalleryContext));

            _context.Database.EnsureCreated();

            InitializePhotoAlbums(imagesPath);
            InitializeUserRoles();

        }

        private static void InitializePhotoAlbums(string imagesPath)
        {
            if (!_context.Albums.Any())
            {
                List<Album> albums = new List<Album>();

                var album1 = _context.Albums.Add(
                    new Album
                    {
                        DateCreated = DateTime.Now,
                        Title = "Album 1",
                        Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    }).Entity;
                var album2 = _context.Albums.Add(
                    new Album
                    {
                        DateCreated = DateTime.Now,
                        Title = "Album 2",
                        Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    }).Entity;
                var album3 = _context.Albums.Add(
                    new Album
                    {
                        DateCreated = DateTime.Now,
                        Title = "Album 3",
                        Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    }).Entity;
                var album4 = _context.Albums.Add(
                    new Album
                    {
                        DateCreated = DateTime.Now,
                        Title = "Album 4",
                        Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    }).Entity;

                albums.Add(album1); albums.Add(album2); albums.Add(album3); albums.Add(album4);

                string[] images = Directory.GetFiles(Path.Combine(imagesPath, "images"));
                Random rnd = new Random();

                foreach (string image in images)
                {
                    int selectedAlbum = rnd.Next(1, 4);
                    string fileName = Path.GetFileName(image);

                    _context.Photos.Add(
                        new Photo()
                        {
                            Title = fileName,
                            DateUploaded = DateTime.Now,
                            Uri = fileName,
                            Album = albums.ElementAt(selectedAlbum)
                        }
                        );
                }

                _context.SaveChanges();
            }
        }

        private static void InitializeUserRoles()
        {
            if (!_context.Roles.Any())
            {
                // create roles
                _context.Roles.AddRange(new Role[]
                {
                new Role()
                {
                    Name="Admin"
                }
                });

                _context.SaveChanges();
            }

            if (!_context.Users.Any())
            {
                _context.Users.Add(new User()
                {
                    Email = "chsakells.blog@gmail.com",
                    Username = "chsakell",
                    HashedPassword = "9wsmLgYM5Gu4zA/BSpxK2GIBEWzqMPKs8wl2WDBzH/4=",
                    Salt = "GTtKxJA6xJuj3ifJtTXn9Q==",
                    IsLocked = false,
                    DateCreated = DateTime.Now
                });

                // create user-admin for chsakell
                _context.UserRoles.AddRange(new UserRole[] {
                new UserRole() {
                    RoleId = 1, // admin
                    UserId = 1  // chsakell
                }
            });
                _context.SaveChanges();
            }
        }
    }
}
