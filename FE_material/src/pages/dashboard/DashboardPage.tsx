import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { usePreferencesStore } from '@/store';

// E-commerce Dashboard Components
import EcommerceWelcome from '../../sections/dashboard/EcommerceWelcome';
import EcommerceFeaturedProduct from '../../sections/dashboard/EcommerceFeaturedProduct';
import EcommerceWidgetSummary from '../../sections/dashboard/EcommerceWidgetSummary';
import EcommerceSaleByGender from '../../sections/dashboard/EcommerceSaleByGender';
import EcommerceYearlySales from '../../sections/dashboard/EcommerceYearlySales';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  const settings = usePreferencesStore();

  return (
    <Container maxWidth={settings.themeCompact ? 'xl' : false}>
      <Grid container spacing={3}>
        {/* Row 1: Welcome Banner & Featured Product */}
        <Grid size={{ xs: 12, md: 8 }}>
          <EcommerceWelcome
            title={`Xin chúc mừng! \nJaydon Frankie`}
            description="Người bán hàng xuất sắc nhất tháng. Bạn đã đạt 57.6% doanh số bán hàng hôm nay."
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <EcommerceFeaturedProduct
            title="Nike Air Max 97"
            description="Nike"
            price={199.99}
            discount={20}
          />
        </Grid>

        {/* Row 2: Widget Summary Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EcommerceWidgetSummary
            title="Sản phẩm đã bán"
            total={765}
            percent={2.6}
            icon="solar:cart-3-bold-duotone"
            chart={{
              series: [22, 8, 35, 50, 82, 84, 77, 12, 87, 43],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EcommerceWidgetSummary
            title="Tổng số dư"
            total={18765}
            percent={-0.1}
            color="info"
            icon="solar:wallet-bold-duotone"
            chart={{
              colors: ['#00B8D9'],
              series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EcommerceWidgetSummary
            title="Lợi nhuận bán hàng"
            total={4876}
            percent={0.6}
            color="warning"
            icon="solar:chart-bold-duotone"
            chart={{
              colors: ['#FFAB00'],
              series: [40, 70, 75, 70, 50, 28, 7, 64, 38, 27],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EcommerceWidgetSummary
            title="Đơn hàng mới"
            total={678}
            percent={2.8}
            color="error"
            icon="solar:bag-4-bold-duotone"
            chart={{
              colors: ['#FF5630'],
              series: [56, 30, 23, 54, 47, 40, 62, 73, 67, 68],
            }}
          />
        </Grid>

        {/* Row 3: Charts */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <EcommerceSaleByGender
            title="Doanh số theo giới tính"
            chart={{
              series: [
                { label: 'Nam', value: 44 },
                { label: 'Nữ', value: 75 },
                { label: 'Trẻ em', value: 25 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <EcommerceYearlySales
            title="Doanh số hàng năm"
            subheader="(+43%) so với năm ngoái"
            chart={{
              labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
              series: [
                {
                  name: 'Tổng thu nhập',
                  data: [10, 41, 35, 151, 49, 62, 69, 91, 48, 35, 40, 10],
                },
                {
                  name: 'Tổng chi phí',
                  data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
