using AutoMapper;

namespace PhotoGallery.Infrastructure.Mappings
{
    public class AutoMapperConfiguration
    {
        public static void Configure()
        {           
            Mapper.Initialize(cfg => {
                cfg.AddProfile<DomainToViewModelMappingProfile>();
            });
        }
    }
}
